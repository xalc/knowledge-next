import { DocNode } from "@/types/docs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Folder, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { sortNodes } from "./doc-nav";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
interface DocNavItemProps {
  node: DocNode;
  level?: number;
  currentSlug?: string;
}
export function DocNavItem({ node, level = 0, currentSlug }: DocNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = currentSlug === node.slug;

  const hasActiveChild =
    node.type === "directory" &&
    node.children?.some(child => {
      const isNodeActive = (node: DocNode): boolean => {
        if (node.slug === currentSlug) {
          return true;
        }
        if (node.type === "directory" && node.children) {
          return node.children.some(child => isNodeActive(child));
        }
        return false;
      };

      return isNodeActive(child);
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
            hasActiveChild && "bg-muted/50 font-medium text-blue-700",
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
                currentSlug={currentSlug}
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
    >
      <FileText
        className={cn("mr-2 h-4 w-4 shrink-0 text-muted-foreground", isActive && "text-blue-500")}
      />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}
