import { PrismaClient } from "@prisma/client";

import BlogEditor from "@/components/blogs/BlogEditor";
import { Link } from "@/components/ui/link";
import { ChevronLeft } from "lucide-react";
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

  try {
    const post = await getPost(slug);
    return (
      <div className="flex flex-col">
        <title>{post.title}</title>
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {post.title}
        </h1>
        <Link href={"/blogs"}>
          <ChevronLeft />
        </Link>

        <article className="w-5/6 self-center pb-16">
          <BlogEditor post={post} />
        </article>
      </div>
    );
  } catch (error) {
    throw error;
  }
}
