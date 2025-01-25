import { getDocBySlug } from "@/lib/docs";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(decodeURIComponent(slug));

  if (!doc) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="prose prose-lg max-w-none">{doc.content}</div>
    </div>
  );
}
