"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: { tag: string; count: number }[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge
        variant="secondary"
        className={cn(
          "cursor-pointer hover:bg-primary hover:text-primary-foreground",
          selectedTag === null && "bg-primary text-primary-foreground",
        )}
        onClick={() => onTagSelect(null)}
      >
        全部
      </Badge>
      {tags.map(({ tag, count }) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn(
            "cursor-pointer hover:bg-primary hover:text-primary-foreground",
            selectedTag === tag && "bg-primary text-primary-foreground",
          )}
          onClick={() => onTagSelect(tag)}
        >
          {tag} ({count})
        </Badge>
      ))}
    </div>
  );
}
