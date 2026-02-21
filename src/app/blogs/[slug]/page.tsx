import BlogEditor from "@/components/blogs/blog-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPost, getPosts } from "@/lib/blogs/blogs";
import { getLocale, getMessages } from "@/lib/i18n";
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPage({ params }) {
  const slug = (await params).slug;
  const [post, locale] = await Promise.all([getPost(slug), getLocale()]);
  const messages = getMessages(locale);
  return (
    <div className="container mx-auto">
      <title>{post.title}</title>
      <meta name="keywords" content={post.metadata.tags.toString()} />
      <meta name="description" content={post.description} />

      <div className="mx-12 mt-8">
        <Button variant="ghost" className="mb-6 gap-2 pl-0" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            {messages.blogs.backToList}
          </Link>
        </Button>
      </div>
      <BlogEditor post={post} />
    </div>
  );
}
