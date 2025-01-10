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
      <div className="mx-12 mt-8">
        <Button variant="ghost" className="mb-6 gap-2 pl-0" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </Button>
      </div>

      <div className="mx-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
        <div className="space-y-10">
          <article className="">
            <BlogEditor post={post} />
          </article>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20">
            {/* <TableOfContents />
             */}
            This is toc
          </div>
        </div>
      </div>
    </div>
  );
}
