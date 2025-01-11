import { getCredly } from "@/lib/credly";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Trophy, Target } from "lucide-react";
import SkillsOverView from "@/components/badge/skills-overview";
import BadgeWithActions from "@/components/badge/filter-bages";
import CertificationTypeStats from "@/components/badge/certification-type-stats";
import CredlySvg from "/public/images/credly.svg";
import Image from "next/image";

const BadgesPage = async () => {
  const badges = await getCredly();
  const getSkills = badges => {
    const skillCounts = {};
    badges.forEach(badge => {
      const skills = badge.badge_template.skills;
      skills.forEach(skill => {
        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
      });
    });
    return Object.entries(skillCounts).sort(([, a], [, b]) => Number(b) - Number(a));
  };

  const getCategories = badges => {
    const categories = {};
    badges.forEach(badge => {
      const { type_category } = badge.badge_template;
      categories[type_category] = (categories[type_category] || 0) + 1;
    });
    return Object.entries(categories).sort(([, a], [, b]) => Number(b) - Number(a));
  };
  const skills = getSkills(badges);
  const categories = getCategories(badges);
  const stats = {
    totalBadges: badges.length,
    totalHours: badges.reduce((acc, badge) => {
      const hours = parseInt(badge.badge_template.time_to_earn) || 0;
      return acc + hours;
    }, 0),
    uniqueSkills: Array.from(new Set(badges.flatMap(badge => badge.badge_template.skills))).length,
    certifications: badges.filter(badge => badge.badge_template.type_category === "Certification")
      .length,
  };
  return (

    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <div className="mx-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Image src={CredlySvg} width={64} alt="Credly Icon" />
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              展示来自
              <a
                href="https://www.credly.com/users/xalc"
                className="px-2 font-bold text-primary"
                target="_blank"
              >
                Credly
              </a>
              的数字证书和专业技能
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总认证数</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBadges}</div>
            <p className="text-xs text-muted-foreground">包含证书和徽章</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">专业技能</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSkills}</div>
            <p className="text-xs text-muted-foreground">掌握的技能数量</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Overview */}
      <CertificationTypeStats categories={categories} />
      <SkillsOverView skills={skills} />
      <BadgeWithActions badges={badges} />
    </div>

  );
};

export default BadgesPage;
