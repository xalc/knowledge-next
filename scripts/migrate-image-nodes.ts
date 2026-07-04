/**
 * 检查并迁移 PostContent 中遗留的 type:"image" 节点到 type:"imageBlock"
 *
 * 用法: npx tsx scripts/migrate-image-nodes.ts [--dry-run]
 *
 * 背景: 移除默认 Image 扩展后，DB 中若存在 type:"image" 节点会渲染丢失。
 * 此脚本递归遍历 PostContent.content JSON，把 type:"image" 转成 type:"imageBlock"，
 * 并保留 src 属性。
 */
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapNode[];
  text?: string;
}

function migrateNode(node: TiptapNode): { node: TiptapNode; changed: boolean } {
  let changed = false;
  if (node.type === "image") {
    changed = true;
    node = {
      ...node,
      type: "imageBlock",
      attrs: {
        src: node.attrs?.src ?? "",
        width: "100%",
        align: "center",
        alt: node.attrs?.alt,
      },
    };
  }
  if (node.content) {
    const migrated = node.content.map(child => migrateNode(child));
    if (migrated.some(m => m.changed)) changed = true;
    node = { ...node, content: migrated.map(m => m.node) };
  }
  return { node, changed };
}

async function main() {
  const posts = await prisma.postContent.findMany();
  let totalChanged = 0;

  for (const post of posts) {
    const content = post.content as TiptapNode;
    if (!content || typeof content !== "object") continue;

    const { node, changed } = migrateNode(content);
    if (!changed) continue;

    totalChanged++;
    console.log(`[迁移] PostContent id=${post.id}`);
    if (!dryRun) {
      await prisma.postContent.update({
        where: { id: post.id },
        data: { content: node as unknown as Prisma.InputJsonValue },
      });
    }
  }

  console.log(
    dryRun
      ? `[dry-run] 发现 ${totalChanged} 篇文章含 type:"image" 节点，需迁移`
      : `[完成] 迁移了 ${totalChanged} 篇文章的 image 节点 -> imageBlock`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
