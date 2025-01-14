"use client";

import Link from "next/link";
import moment from "moment";
import "moment/locale/zh-cn";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Tag, ExternalLink } from "lucide-react";
import type { Badge } from "@/types/badge";
import Image from "next/image";

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  // const { badge_template: template, issued_at_date, expires_at_date, state } = badge;
  const { badge_template: template } = badge;
  // Set locale to Chinese
  moment.locale("zh-cn");

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            fill
            priority={false}
            src={template.image_url}
            alt={template.name}
            sizes={"w-full"}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
            <p className="line-clamp-3 text-sm text-accent-foreground">{template.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="h-auto p-0 text-left font-semibold hover:no-underline"
              >
                <span className="line-clamp-2">{template.name}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-svh overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{template.name}</DialogTitle>
                <DialogDescription>{template.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Award className="h-4 w-4" />
                      难度级别
                    </div>
                    <p className="text-sm text-muted-foreground">{template.level}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4" />
                      类型
                    </div>
                    <p className="text-sm text-muted-foreground">{template.type_category}</p>
                  </div>
                </div>
                {template.skills?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">相关技能</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.skills.map((skill, index) => (
                        <UIBadge key={`skill_${index}`} variant="secondary">
                          {skill.name}
                        </UIBadge>
                      ))}
                    </div>
                  </div>
                )}
                {template.badge_template_activities?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">完成活动</h4>
                    <ul className="space-y-1">
                      {template.badge_template_activities.map((activity, index) => (
                        <li key={`activity_${index}`} className="text-sm text-muted-foreground">
                          • {activity.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>颁发于 {issuedDate}</span>
          </div>
          {expiryDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>过期于 {expiryDate}</span>
            </div>
          )}
        </div> */}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between p-4 pt-0">
        {/* <UIBadge variant="secondary" className="pointer-events-none">
          {template.type_category}
        </UIBadge> */}
        <UIBadge className="whitespace-nowrap">{template.issuer.entities[0].entity.name}</UIBadge>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={template.url} target="_blank" className="gap-2">
              <span>查看证书</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
