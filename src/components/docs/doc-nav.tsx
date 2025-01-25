"use client";

import { DocNode } from "@/types/docs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Folder, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocNavItemProps {
  node: DocNode;
  level?: number;
  currentSlug?: string;
  onItemFound?: () => void;
}

// 对节点进行排序的函数
function sortNodes(a: DocNode, b: DocNode): number {
  // 首先按类型排序（目录在前）
  if (a.type !== b.type) {
    return a.type === "directory" ? -1 : 1;
  }
  const aStartsWithNumber = /^\d/.test(a.name);
  const bStartsWithNumber = /^\d/.test(b.name);

  if (aStartsWithNumber && bStartsWithNumber) {
    // 提取开头的数字进行比较
    const aNum = parseInt(a.name.match(/^\d+/)?.[0] || "0");
    const bNum = parseInt(b.name.match(/^\d+/)?.[0] || "0");
    return aNum - bNum;
  }

  // 数字开头的排在前面
  if (aStartsWithNumber) return -1;
  if (bStartsWithNumber) return 1;
  return a.name.localeCompare(b.name);
}

function DocNavItem({ node, level = 0, currentSlug, onItemFound }: DocNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 解码 URL 编码的 slug 进行比较
  const decodedCurrentSlug = currentSlug ? decodeURIComponent(currentSlug) : "";
  const isActive = decodedCurrentSlug === node.slug;

  // 调试日志
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Node slug:", node.slug);
      console.log("Current slug:", decodedCurrentSlug);
      console.log("Is active:", isActive);
    }
  }, [node.slug, decodedCurrentSlug, isActive]);

  useEffect(() => {
    if (isActive && onItemFound) {
      onItemFound();
    }
  }, [isActive, onItemFound]);

  // 检查子项中是否包含当前活动项
  const hasActiveChild =
    node.type === "directory" &&
    node.children?.some(child => {
      const childIsActive = child.slug === decodedCurrentSlug;
      const grandChildIsActive =
        child.type === "directory" &&
        child.children?.some(grandChild => grandChild.slug === decodedCurrentSlug);
      return childIsActive || grandChildIsActive;
    });

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  if (node.type === "directory") {
    const sortedChildren = [...(node.children || [])].sort(sortNodes);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center rounded-md p-2 hover:bg-muted/50",
            hasActiveChild && "bg-muted/50 font-medium",
          )}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
          <Folder
            className={cn(
              "ml-1 h-4 w-4 shrink-0 text-muted-foreground",
              isOpen && "text-blue-500",
              hasActiveChild && "text-blue-500",
            )}
          />
          <span className="ml-1 truncate text-sm font-medium">{node.name}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-4 mt-1 border-l pl-2">
            {sortedChildren.map(child => (
              <DocNavItem
                key={child.path}
                node={child}
                level={level + 1}
                currentSlug={decodedCurrentSlug}
                onItemFound={onItemFound}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={`/docs/${encodeURIComponent(node.slug)}`}
      className={cn(
        "group flex items-center rounded-md px-2 py-2 text-sm hover:bg-muted/50",
        isActive && "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      )}
      onClick={() => {
        if (onItemFound) onItemFound();
      }}
    >
      <FileText
        className={cn("mr-2 h-4 w-4 shrink-0 text-muted-foreground", isActive && "text-blue-500")}
      />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

interface DocNavProps {
  tree: DocNode[];
  currentSlug?: string;
  mobileView?: boolean;
}

export function DocNav({ tree, currentSlug, mobileView = false }: DocNavProps) {
  const sortedTree = [...tree].sort(sortNodes);
  const [activeItemFound, setActiveItemFound] = useState(false);

  return (
    <div className={cn(mobileView ? "h-[calc(100vh-8rem)] w-full" : "h-screen")}>
      <ScrollArea className="h-full">
        <div className="space-y-1 p-4">
          {sortedTree.map(node => (
            <DocNavItem
              key={node.path}
              node={node}
              currentSlug={currentSlug}
              onItemFound={() => setActiveItemFound(true)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
