import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DocNode } from "@/types/docs";
import { getDocTree, findDocNodeBySlug } from "@/lib/docs";
import { Fragment } from "react";

interface DocBreadcrumbProps {
  slug: string;
}

export function DocBreadcrumb({ slug }: DocBreadcrumbProps) {
  const tree = getDocTree();
  const currentNode = findDocNodeBySlug(tree, decodeURIComponent(slug));

  if (!currentNode) return null;

  const getAllNodes = (nodes: DocNode[]): DocNode[] => {
    return nodes.reduce((acc: DocNode[], node) => {
      if (node.type === "directory" && node.children) {
        return [...acc, node, ...getAllNodes(node.children)];
      }
      return [...acc, node];
    }, []);
  };

  const buildPathNodes = (node: DocNode, allNodes: DocNode[]): DocNode[] => {
    const parent = allNodes.find(
      n => n.type === "directory" && n.children?.some(child => child.slug === node.slug),
    );

    if (parent) {
      return [...buildPathNodes(parent, allNodes), node];
    }
    return [node];
  };

  const allNodes = getAllNodes(tree);
  const pathNodes = buildPathNodes(currentNode, allNodes);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathNodes.map((node, index) => {
          const isLast = index === pathNodes.length - 1;
          return (
            <Fragment key={node.slug}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{node.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/docs/${encodeURIComponent(node.slug)}`}>
                    {node.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
