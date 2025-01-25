import { getDocTree } from "@/lib/docs";
import { DocNav } from "@/components/docs/doc-nav";
import { MobileNav } from "@/components/docs/mobile-nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug?: string };
}) {
  const tree = getDocTree();
  const currentSlug = params.slug || "";

  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <DocNav tree={tree} currentSlug={currentSlug} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="container p-4">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">文档</h1>
              </div>
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="block md:hidden">
        <div className="container p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">文档</h1>
            <MobileNav tree={tree} currentSlug={currentSlug} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
