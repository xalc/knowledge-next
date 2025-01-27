import { getDocBySlug } from "@/lib/docs";
import { notFound } from "next/navigation";
import { DocBreadcrumb } from "@/components/docs/doc-breadcrumb";
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
    <div className="mb-12 space-y-8 p-8">
      <DocBreadcrumb slug={slug} />
      <div>{doc.content}</div>
    </div>
  );
}
