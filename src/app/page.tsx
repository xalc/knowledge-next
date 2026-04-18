import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import StartHere from "@/components/about/start-here";
import TopBadge from "@/components/badge/top-badge";
import RecentPosts from "@/components/blogs/recent-blogs";
import RecentReadingBooks from "@/components/wereader/recent-reading";
import SkillsOverView from "@/components/badge/skills-overview";
import { getCredly } from "@/lib/credly";

export default async function RootPage() {
  const badges = await getCredly();
  const getSkills = (badgesData: unknown[]) => {
    const skillCounts: Record<string, number> = {};

    interface CredlyBadge {
      badge_template?: {
        skills?: Array<{ name: string }>;
      };
    }
    (badgesData as CredlyBadge[]).forEach(badge => {
      const skills = badge?.badge_template?.skills || [];
      skills.forEach((skill: { name: string }) => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
      });
    });
    return Object.entries(skillCounts).sort(([, a], [, b]) => Number(b) - Number(a));
  };

  const skills = getSkills(badges);

  return (
    <div className="flex w-full flex-col gap-8 pb-20">
      <HeroSection />

      <section className="container mx-auto mt-12 lg:max-w-[1024px]">
        <div className="mx-6 space-y-6">
          <div className="space-y-2">
            <p className="font-geek text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Skills
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">技能图谱</h2>
            <p className="max-w-[520px] text-sm text-muted-foreground">
              来自于 Credly 认证的专业技能总览，涵盖编程、系统设计、敏捷管理等多个维度。
            </p>
          </div>
          <div className="-mx-6">
            <SkillsOverView skills={skills} />
          </div>
        </div>
      </section>

      <StartHere />
      <ContentCard />
      <RecentPosts />
      <RecentReadingBooks />
      <TopBadge />
    </div>
  );
}
