"use client";

import { DocNode } from "@/types/docs";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocNavItem } from "./doc-nav-item";

import { usePathname } from "next/navigation";
interface DocNavProps {
  tree: DocNode[];
  mobileView?: boolean;
}
export function sortNodes(a: DocNode, b: DocNode): number {
  if (a.type !== b.type) {
    return a.type === "directory" ? -1 : 1;
  }
  const aStartsWithNumber = /^\d/.test(a.name);
  const bStartsWithNumber = /^\d/.test(b.name);

  if (aStartsWithNumber && bStartsWithNumber) {
    const aNum = parseInt(a.name.match(/^\d+/)?.[0] || "0");
    const bNum = parseInt(b.name.match(/^\d+/)?.[0] || "0");
    return aNum - bNum;
  }

  if (aStartsWithNumber) return -1;
  if (bStartsWithNumber) return 1;
  return a.name.localeCompare(b.name);
}
export function DocNav({ tree, mobileView = false }: DocNavProps) {
  const sortedTree = [...tree].sort(sortNodes);
  const pathname = usePathname();
  const currentSlug = decodeURIComponent(pathname.split("/").pop());

  return (
    <div className={cn(mobileView ? "h-[calc(100vh-8rem)] w-full" : "h-screen")}>
      <ScrollArea className="h-full">
        <div className="space-y-1 p-4">
          {sortedTree.map(node => (
            <DocNavItem key={node.path} node={node} currentSlug={currentSlug} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
