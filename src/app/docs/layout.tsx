import { getDocTree } from "@/lib/docs";
import { DocNav } from "@/components/docs/doc-nav";
import { MobileNav } from "@/components/docs/mobile-nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
export default async function DocLayout({ children }: { children: React.ReactNode }) {
  const tree = getDocTree();

  return (
    <div className="border-t border-border shadow-sm md:max-h-[calc(100vh_-_132px)]">
      <div className="hidden md:block">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <DocNav tree={tree} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <ScrollArea className="container h-[calc(100vh-100px)] p-4">{children}</ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="block md:hidden">
        <div className="container p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">文档</h1>
            <MobileNav tree={tree} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
