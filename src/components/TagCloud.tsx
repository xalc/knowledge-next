"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TagMerger } from "@/lib/utils/tag-merger";

interface Tag {
  tag: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
  const mergedTags = useMemo(() => {
    // 先合并相似标签，再按数量排序
    const merged = TagMerger.mergeSimilarTags(tags);
    return merged.sort((a, b) => b.count - a.count);
  }, [tags]);

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {mergedTags.map(({ tag, count }) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn(
            "cursor-pointer hover:bg-primary hover:text-primary-foreground",
            getTagSizeClass(count),
          )}
        >
          {tag} ({count})
        </Badge>
      ))}
    </div>
  );
};

// 根据标签数量返回对应的样式类名
function getTagSizeClass(count: number): string {
  if (count >= 10) return "text-lg";
  if (count >= 5) return "text-base";
  return "text-sm";
}

export default TagCloud;
