import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "./badge-card";

import Link from "next/link";
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
            <Button variant="outline" asChild>
              <Link href="/badges">查看更多</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {badges.slice(0, 4).map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
