import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { DocType, DocNode } from "@/types/docs";
import { mdxComponents } from "@/components/docs/mdx-components";

export async function getAllDocs(): Promise<DocType[]> {
  const docsDirectory = path.join(process.cwd(), "src", "notes");
  try {
    const allFiles = fs.readdirSync(docsDirectory);
    const markdownFiles = allFiles.filter(filename => {
      const filePath = path.join(docsDirectory, filename);
      const stats = fs.statSync(filePath);
      return stats.isFile() && /\.(md|mdx)$/.test(filename);
    });

    // 处理合法的文件
    const docs = await Promise.all(
      markdownFiles.map(async filename => {
        const filePath = path.join(docsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const stats = fs.statSync(filePath);

        const { content } = await compileMDX({
          source: fileContent,
          options: { parseFrontmatter: true },
        });

        const slug = filename.replace(/\.mdx?$/, "");

        return {
          slug,
          title: slug.replace(/-/g, " "),
          content: content,
          createdAt: stats.birthtimeMs,
        };
      }),
    );

    return docs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error reading docs:", error);
    return [];
  }
}

export function findDocNodeBySlug(tree: DocNode[], slug: string): DocNode | null {
  for (const node of tree) {
    if (node.type === "file" && node.slug === slug) {
      return node;
    }

    if (node.type === "directory" && node.children) {
      const found = findDocNodeBySlug(node.children, slug);
      if (found) return found;
    }
  }

  return null;
}

function generateSimpleSlug(name: string): string {
  return name.replace(/\.(md|mdx)$/, "").replace(/\s+/g, "_");
}

export function getDocTree(basePath: string = ""): DocNode[] {
  const fullPath = basePath
    ? path.join(process.cwd(), "src", "notes", basePath)
    : path.join(process.cwd(), "src", "notes");
  const items = fs.readdirSync(fullPath);

  return items
    .map(item => {
      const itemPath = path.join(fullPath, item);
      const stats = fs.statSync(itemPath);
      const relativePath = basePath ? path.join(basePath, item) : item;

      if (stats.isDirectory()) {
        const children = getDocTree(relativePath);
        if (children.length > 0) {
          return {
            type: "directory",
            name: item,
            slug: generateSimpleSlug(item),
            path: relativePath,
            children,
            createdAt: stats.birthtimeMs,
          };
        }
        return null;
      } else if (/\.(md|mdx)$/.test(item)) {
        return {
          type: "file",
          name: item.replace(/\.(md|mdx)$/, ""),
          slug: generateSimpleSlug(item),
          path: relativePath,
          createdAt: stats.birthtimeMs,
        };
      }
      return null;
    })
    .filter(Boolean) as DocNode[];
}
export function getAllSlugs(): string[] {
  const tree = getDocTree();
  const slugs = [];
  const visitNode = nodes => {
    nodes.forEach(node => {
      if (node.type === "file") {
        slugs.push(node.slug);
      } else if (node.type === "directory" && node.children) {
        visitNode(node.children);
      }
    });
  };

  tree.forEach(t => {
    if (t.type === "file") {
      slugs.push(t.slug);
    } else if (t.type === "directory" && t.children) {
      visitNode(t.children);
    }
  });
  return slugs;
}
const remarkImgToAbsolute = (docsDir, nodePath) => () => tree => {
  const visitNode = node => {
    if (node.type === "image") {
      const relativePath = node.url;
      if (!node.url.startsWith("http")) {
        try {
          const absPath = path
            .join(path.dirname(nodePath), decodeURIComponent(relativePath))
            .replace(/\.(md|mdx)$/, "");

          node.url = absPath;
        } catch (e) {
          console.error("resolve path error", node.url, docsDir, e);
        }
      }
    } else if (node.children) {
      node.children.forEach(visitNode);
    }
  };

  visitNode(tree);
};
export async function getDocBySlug(slug: string): Promise<DocType | null> {
  try {
    const tree = getDocTree();
    const docNode = findDocNodeBySlug(tree, slug);

    if (!docNode || docNode.type === "directory") {
      return null;
    }

    const docsDirectory = path.join(process.cwd(), "src", "notes");
    const filePath = path.join(docsDirectory, docNode.path);

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return null;
    }

    if (!filePath.match(/\.(md|mdx)$/)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const { content } = await compileMDX({
      source: fileContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkImgToAbsolute(docsDirectory, docNode.path)],
        },
      },

      components: mdxComponents,
    });

    return {
      slug: docNode.slug,
      title: docNode.name,
      content,
      createdAt: stats.birthtimeMs,
    };
  } catch (error) {
    console.error("Error in getDocBySlug:", error);
    return null;
  }
}
