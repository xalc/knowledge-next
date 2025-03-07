import { getDocBySlug } from "@/lib/docs";
import { notFound } from "next/navigation";
import { DocBreadcrumb } from "@/components/docs/doc-breadcrumb";

export default async function DocPage() {
  const defaultSlug = "index";
  const doc = await getDocBySlug(decodeURIComponent(defaultSlug));

  if (!doc) {
    notFound();
  }

  return (
    <div className="container mb-12 max-w-[768px] space-y-8 p-8">
      <DocBreadcrumb slug={defaultSlug} />
      <div>{doc.content}</div>
    </div>
  );
}
