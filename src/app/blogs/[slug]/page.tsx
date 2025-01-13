import { PrismaClient } from "@prisma/client";

import BlogEditor from "@/components/blogs/BlogEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

const getPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    include: {
      postcontent: true,
    },
  });
  return post;
};

export default async function BlogPage({ params }) {
  const slug = (await params).slug;
  const post = await getPost(slug);
  return (
    <div className="container mx-auto">
      <title>{post.title}</title>
      <meta name="keywords" content={post.metadata.tags.toString()} />
      <meta name="description" content={post.description} />

      <div className="mx-12 mt-8">
        <Button variant="ghost" className="mb-6 gap-2 pl-0" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </Button>
      </div>

      <div className="mx-12 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_240px]">
        <div className="space-y-10">
          <article className="mb-36">
            <BlogEditor post={post} />
          </article>
        </div>
        <div className="hidden xl:block">
          <div className="sticky top-20">
            {/* <TableOfContents />
             */}
            <div className="text-xl">This is toc</div>
            available later...
          </div>
        </div>
      </div>
    </div>
  );
}
