import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BadgeCard } from "./badge-card";
import { MotionButton } from "@/components/ui/motion-button";
import { Trophy } from "lucide-react";
import { getCredly } from "@/lib/credly";

export default async function TopBadge() {
  const badges = await getCredly();

  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">技能认证</CardTitle>
              <CardDescription>获得的专业技能认证和徽章</CardDescription>
            </div>
            <MotionButton href="/badges" icon={<Trophy className="h-5 w-5" />}>
              查看更多
            </MotionButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.slice(0, 4).map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
