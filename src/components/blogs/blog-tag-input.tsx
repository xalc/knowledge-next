import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Tag {
  value: string;
  label: string;
  count?: number;
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  existingTags?: Tag[];
  className?: string;
  placeholder?: string;
}

export function TagInput({
  value = [],
  onChange,
  existingTags = [],
  className,
  placeholder = "输入标签，按回车或逗号添加",
}: TagInputProps) {
  const [tagInput, setTagInput] = useState("");

  // 处理标签输入
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() && !value.includes(tagInput.trim())) {
        onChange([...value, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  // 添加标签
  const addTag = (newTag: string) => {
    if (!value.includes(newTag)) {
      onChange([...value, newTag]);
    }
  };

  // 过滤推荐标签
  const filteredTags = useMemo(() => {
    return existingTags.filter(
      tag => !value.includes(tag.value) && tag.label.toLowerCase().includes(tagInput.toLowerCase()),
    );
  }, [existingTags, value, tagInput]);

  // 获取热门标签
  const hotTags = useMemo(() => {
    return existingTags.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 8);
  }, [existingTags]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* 已选标签 */}
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <div
            key={tag}
            className="group flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 transition-colors hover:bg-secondary/80"
          >
            <span className="text-sm">{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-50 group-hover:opacity-100"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* 标签输入和推荐 */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={placeholder}
            className="h-10"
          />
        </div>

        {/* 推荐标签 */}
        {filteredTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">推荐标签</div>
            <div className="flex flex-wrap gap-2">
              {filteredTags.map(tag => (
                <Button
                  key={tag.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => addTag(tag.value)}
                >
                  {tag.label}
                  {tag.count !== undefined && (
                    <span className="ml-1.5 text-xs text-muted-foreground">{tag.count}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 热门标签 */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">热门标签</div>
          <div className="flex flex-wrap gap-2">
            {hotTags.map(tag => (
              <Button
                key={tag.value}
                type="button"
                variant="ghost"
                size="sm"
                className={cn("h-8", value.includes(tag.value) && "bg-secondary")}
                onClick={() => addTag(tag.value)}
              >
                {tag.label}
                {tag.count !== undefined && (
                  <span className="ml-1.5 text-xs text-muted-foreground">{tag.count}</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
