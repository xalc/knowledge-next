import { getAllDocs } from "@/lib/docs";
import Link from "next/link";

export default async function DocPage() {
  const docs = await getAllDocs();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">文档分类</h1>
      <div className="space-y-4">
        {docs.map(doc => (
          <div key={doc.slug} className="rounded-lg border p-4">
            <Link href={`/docs/${doc.slug}`} className="text-lg font-medium hover:text-primary">
              {doc.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
