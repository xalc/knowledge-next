import BlogEditor from "@/components/blogs/blog-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPost, getPosts } from "@/lib/blogs/blogs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  const updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt);
  const hasValidCreatedAt = !Number.isNaN(createdAt.getTime());
  const hasValidUpdatedAt = !Number.isNaN(updatedAt.getTime());

  const tags = Array.isArray(post.metadata?.tags)
    ? post.metadata.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    title: post.title,
    description: post.description,
    keywords: tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      ...(hasValidCreatedAt && { publishedTime: createdAt.toISOString() }),
      ...(hasValidUpdatedAt && { modifiedTime: updatedAt.toISOString() }),
      ...(tags.length > 0 && { tags }),
      ...(post.cover && { images: [{ url: post.cover }] }),
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(post.cover && { images: [post.cover] }),
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <div className="mx-12 mt-8">
        <Button variant="ghost" className="mb-6 gap-2 pl-0" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </Button>
      </div>
      <BlogEditor post={post} />
    </div>
  );
}
