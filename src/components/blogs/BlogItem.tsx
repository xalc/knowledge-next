
import { Link } from '@/components/ui/link';
type Meta = {
  tags: string[];
  author: string;
}
type Blog = {
  title: string;
  description: string;
  slug: string;
  metadata: Meta;
  updatedAt: Date
}
export default function BlogItem({ blog }: { blog: Blog }) {
  const { title, description, slug } = blog;
  return (
    <Link href={`/blogs/${slug}`} className={'bg-secondary p-4  rounded-xl border w-full no-underline text-inherit'}>
      <h3 className="text-2xl font-semibold">{title}</h3>
      {blog.metadata?.tags && blog.metadata.tags?.map((tag, index) => <span className={"px-4"} key={index}>{tag}</span>)}
      <p>最新修改时间 {blog.updatedAt.toLocaleDateString()}</p>
      <p>{description}</p>
    </Link>

  );
}