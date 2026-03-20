import { deepseek } from "@ai-sdk/deepseek";
import { streamText, tool } from "ai";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getCredly } from "@/lib/credly";
import { getReadingSummaryByYear } from "@/lib/wereader/wr-db";

export const maxDuration = 30;

const updateBlogParams = z.object({
  slug: z.string().optional().describe("博客 slug，例如 2025-4-20"),
  title: z.string().optional().describe("新的标题"),
  description: z.string().optional().describe("新的描述"),
  cover: z.string().optional().describe("新的封面 URL"),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .describe("标签数组，或用逗号分隔的字符串"),
});

const searchBlogsParams = z.object({
  query: z.string().optional().describe("可选关键字，匹配标题/描述/slug"),
  limit: z.number().int().min(1).max(20).default(8),
});

function normalizeTags(tags: string[] | string | undefined): string[] | undefined {
  if (!tags) return undefined;
  if (Array.isArray(tags)) {
    return tags.map(item => item.trim()).filter(Boolean);
  }
  return tags
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function buildReadingPlanTips(options: {
  daysRead: number;
  avgDailyMinutes: number;
  remainingDays: number;
  targetMinutesPerDay: number;
}) {
  const { daysRead, avgDailyMinutes, remainingDays, targetMinutesPerDay } = options;
  return [
    `建议每日至少 ${targetMinutesPerDay} 分钟，优先固定时段阅读。`,
    daysRead < 60
      ? "活跃天数偏少，先把目标改成“每周 5 天打开读书”。"
      : "活跃天数不错，下一步提升单次专注时长。",
    avgDailyMinutes < targetMinutesPerDay
      ? `当前日均 ${avgDailyMinutes} 分钟，建议每次阅读 +10 分钟逐步爬坡。`
      : `当前日均 ${avgDailyMinutes} 分钟，保持节奏即可。`,
    remainingDays > 0
      ? `今年还剩 ${remainingDays} 天，按计划可稳定完成年度目标。`
      : "今年已结束，可把计划切换到下一年。",
  ];
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `你是我的站点 AI Skills 助手，负责执行以下能力：
1) 更新博客基础信息（title/description/tags/cover）
2) 查看阅读计划（基于年度阅读数据给建议）
3) 查看徽章概览（数量、分类、Top 技能）
4) 检索博客

工作规则：
- 任何事实类信息必须调用工具，不要编造。
- 当用户要更新博客但信息不足时，先追问最少必要字段（优先追问 slug，再追问具体要改哪些字段）。
- 回答用中文，简洁、可执行。`;

  const session = await verifySession();

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: systemPrompt,
    messages,
    maxSteps: 6,
    tools: {
      list_recent_blogs: tool({
        description: "列出最近的博客，帮助用户选择要更新的文章",
        parameters: z.object({
          limit: z.number().int().min(1).max(20).default(8),
        }),
        execute: async ({ limit }) => {
          const posts = await prisma.post.findMany({
            orderBy: { updatedAt: "desc" },
            take: limit,
            select: {
              slug: true,
              title: true,
              updatedAt: true,
              description: true,
            },
          });
          return {
            ok: true,
            count: posts.length,
            posts: posts.map(post => ({
              ...post,
              updatedAt: post.updatedAt.toISOString(),
            })),
          };
        },
      }),
      search_blogs: tool({
        description: "按关键字检索博客（标题、描述、slug）",
        parameters: searchBlogsParams,
        execute: async ({ query, limit }) => {
          const where = query
            ? {
                OR: [
                  { slug: { contains: query, mode: "insensitive" as const } },
                  { title: { contains: query, mode: "insensitive" as const } },
                  { description: { contains: query, mode: "insensitive" as const } },
                ],
              }
            : undefined;

          const posts = await prisma.post.findMany({
            where,
            orderBy: { updatedAt: "desc" },
            take: limit,
            select: {
              slug: true,
              title: true,
              description: true,
              updatedAt: true,
              metadata: true,
            },
          });

          return {
            ok: true,
            query: query ?? "",
            count: posts.length,
            posts: posts.map(post => ({
              slug: post.slug,
              title: post.title,
              description: post.description,
              updatedAt: post.updatedAt.toISOString(),
              tags: (post.metadata as { tags?: string[] })?.tags ?? [],
            })),
          };
        },
      }),
      update_blog: tool({
        description: "更新博客基础信息（不修改正文）",
        parameters: updateBlogParams,
        execute: async params => {
          if (!session?.isAuth) {
            return {
              ok: false,
              status: "unauthorized",
              message: "需要先登录后才能更新博客。",
            };
          }

          if (!params.slug) {
            return {
              ok: false,
              status: "need_more_details",
              question: "请先告诉我要更新的博客 slug（例如 2025-4-20）。",
            };
          }

          const post = await prisma.post.findUnique({
            where: { slug: params.slug },
          });

          if (!post) {
            const candidates = await prisma.post.findMany({
              where: {
                OR: [
                  { slug: { contains: params.slug, mode: "insensitive" } },
                  { title: { contains: params.slug, mode: "insensitive" } },
                ],
              },
              take: 5,
              orderBy: { updatedAt: "desc" },
              select: { slug: true, title: true },
            });

            return {
              ok: false,
              status: "not_found",
              message: "未找到对应 slug 的博客。",
              candidates,
            };
          }

          const nextTags = normalizeTags(params.tags);
          const hasChanges =
            params.title !== undefined ||
            params.description !== undefined ||
            params.cover !== undefined ||
            nextTags !== undefined;

          if (!hasChanges) {
            return {
              ok: false,
              status: "need_more_details",
              question: "你希望改哪些字段？可选：title、description、tags、cover。",
            };
          }

          const previousMetadata = (post.metadata ?? {}) as {
            author?: string;
            date?: string;
            tags?: string[];
            excerpt?: string | null;
          };

          const updated = await prisma.post.update({
            where: { id: post.id },
            data: {
              ...(params.title !== undefined ? { title: params.title } : {}),
              ...(params.description !== undefined ? { description: params.description } : {}),
              ...(params.cover !== undefined ? { cover: params.cover } : {}),
              metadata: {
                ...previousMetadata,
                author: previousMetadata.author ?? "HunterX",
                date: new Date().toISOString().split("T")[0],
                tags: nextTags ?? previousMetadata.tags ?? [],
              },
              updatedAt: new Date(),
            },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              cover: true,
              updatedAt: true,
              metadata: true,
            },
          });

          revalidateTag("posts");

          return {
            ok: true,
            status: "updated",
            post: {
              ...updated,
              updatedAt: updated.updatedAt.toISOString(),
            },
          };
        },
      }),
      get_reading_plan: tool({
        description: "查看年度阅读计划与执行建议",
        parameters: z.object({
          year: z.number().int().min(2021).max(new Date().getFullYear()).optional(),
        }),
        execute: async ({ year }) => {
          const targetYear = year ?? new Date().getFullYear();
          const { yearSummary, lastSyncTime } = await getReadingSummaryByYear(targetYear);

          const totalSeconds = yearSummary.reduce(
            (sum, item) => sum + (item.readingSeconds || 0),
            0,
          );
          const daysRead = yearSummary.filter(item => item.readingSeconds > 0).length;
          const totalMinutes = Math.round(totalSeconds / 60);
          const totalHours = Number((totalSeconds / 3600).toFixed(1));

          const isCurrentYear = targetYear === new Date().getFullYear();
          const dayOfYear = isCurrentYear
            ? Math.ceil(
                (Date.now() - new Date(targetYear, 0, 1).getTime()) / (24 * 60 * 60 * 1000),
              ) + 1
            : 365;

          const avgDailyMinutes = dayOfYear > 0 ? Math.round(totalMinutes / dayOfYear) : 0;
          const annualGoalHours = 300;
          const goalTotalSeconds = annualGoalHours * 3600;
          const remainingDays = isCurrentYear ? Math.max(0, 365 - dayOfYear) : 0;
          const remainingSeconds = Math.max(0, goalTotalSeconds - totalSeconds);
          const targetMinutesPerDay =
            remainingDays > 0 ? Math.max(15, Math.ceil(remainingSeconds / remainingDays / 60)) : 0;

          return {
            ok: true,
            year: targetYear,
            summary: {
              totalHours,
              totalMinutes,
              daysRead,
              avgDailyMinutes,
              annualGoalHours,
              remainingDays,
              targetMinutesPerDay,
            },
            tips: buildReadingPlanTips({
              daysRead,
              avgDailyMinutes,
              remainingDays,
              targetMinutesPerDay,
            }),
            lastSyncTime,
          };
        },
      }),
      get_badges_overview: tool({
        description: "查看技能徽章概览，包括数量和Top技能",
        parameters: z.object({}),
        execute: async () => {
          const badges = await getCredly();
          const total = badges.length;
          const certificationCount = badges.filter(
            badge => badge.badge_template?.type_category === "Certification",
          ).length;
          const topSkillsMap = new Map<string, number>();

          badges.forEach(badge => {
            const skills = badge.badge_template?.skills ?? [];
            skills.forEach(skill => {
              topSkillsMap.set(skill, (topSkillsMap.get(skill) || 0) + 1);
            });
          });

          const topSkills = Array.from(topSkillsMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

          return {
            ok: true,
            total,
            certificationCount,
            uniqueSkills: topSkillsMap.size,
            topSkills,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
