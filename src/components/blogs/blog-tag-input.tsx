import { useState, useMemo } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTags } from "@/hooks/use-tags";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function TagInput({
  value = [],
  onChange,
  className,
  placeholder = "输入标签，按回车或逗号添加",
}: TagInputProps) {
  const { tags: apiTags, isLoading } = useTags();
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

  // 添加新的 hotTags 转换
  const hotTags = useMemo(() => {
    return apiTags
      .map(tag => ({
        label: tag.tag,
        count: tag.count,
      }))
      .slice(0, 8);
  }, [apiTags]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* 已选标签 */}
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="h-7 gap-1 px-2">
            {tag}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* 标签输入和推荐 */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={placeholder}
            className="h-9"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => {
              if (tagInput && !value.includes(tagInput)) {
                onChange([...value, tagInput]);
                setTagInput("");
              }
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            添加
          </Button>
        </div>

        {/* 热门标签 */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">热门标签</div>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">加载中...</div>
            ) : (
              hotTags.map(tag => (
                <Badge
                  key={tag.label}
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                    value.includes(tag.label) && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => addTag(tag.label)}
                >
                  {tag.label}
                  {tag.count !== undefined && (
                    <span className="ml-1.5 text-xs text-muted-foreground">{tag.count}</span>
                  )}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
