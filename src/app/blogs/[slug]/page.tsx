import { PrismaClient } from '@prisma/client'

import TiptapEditor from '@/components/editor';
import { Link } from '@/components/ui/link';
const prisma = new PrismaClient()

const getPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug
    },
    include: {
      postcontent: true
    }
  });
  return post;
};

export default async function BlogPage({ params }) {
  const slug = (await params).slug;

  try {
    const post = await getPost(slug);
    return (
      <div className='flex flex-col '>
        <Link href={'/blogs'}>Back</Link>
        <div className='w-5/6 self-center pb-16'>
          <TiptapEditor content={post.postcontent.content} />
        </div>

      </div>
    );
  } catch (error) {
    throw error
  }







}
