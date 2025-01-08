import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "./badge-card";
import { unstable_cache } from "next/cache";
const badgesUrl = `https://www.credly.com/users/xalc/badges`;

const getCredly = unstable_cache(
  async url => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.data;
  },
  ["posts"],
  { revalidate: 3600 * 48, tags: ["posts"] },
);

export default async function Badge() {
  const badges = await getCredly(badgesUrl);

  return (
    <Card className="container mx-auto mt-12 lg:max-w-[1024px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">技能认证</CardTitle>
            <CardDescription>获得的专业技能认证和徽章</CardDescription>
          </div>
          <Button variant="outline">查看全部</Button>
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
  );
}
