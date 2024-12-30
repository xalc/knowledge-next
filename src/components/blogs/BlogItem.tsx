import { Link } from '@/components/ui/link';
type Blog = {
  title: string;
  description: string;
  slug: string;
}
export default function BlogItem({ blog }: { blog: Blog }) {
  const { title, description, slug } = blog;
  return (
    <Link href={`/blogs/${slug}`} className={'bg-secondary p-4  rounded-xl border w-full no-underline text-inherit'}>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p>{description}</p>
    </Link>

  );
}