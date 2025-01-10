"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Trophy, Medal } from "lucide-react";

export default function CertificationTypeStats({ categories }) {
  const total = categories.reduce((acc, cate) => acc + cate[1], 0);
  // 定义类型统计信息
  const states = [];
  const State = [
    {
      icon: Trophy,
      color: "text-yellow-500 dark:text-yellow-400",
    },
    {
      icon: BookOpen,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      icon: Medal,
      color: "text-green-500 dark:text-green-400",
    },
    {
      icon: Award,
      color: "text-purple-500 dark:text-purple-400",
    },
  ];
  categories.forEach((cate, index) => {
    states.push({
      type: cate[0] === "null" ? "Other" : cate[0],
      count: cate[1],
      icon: State[index].icon,
      color: State[index].color,
    });
  });

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle className="text-2xl">徽章类别</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {states.map(stat => (
            <Card key={stat.type}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-lg bg-background/50 p-2 ring-1 ring-background/10 backdrop-blur ${stat.color}`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{stat.type}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 space-y-2">
                  <Progress value={(stat.count / total) * 100} className={stat.color} />
                  <p className="text-right text-xs text-muted-foreground">
                    {Math.round((stat.count / total) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
