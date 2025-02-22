import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function BlogMetaPopup({ children, editor }) {
  return (
    <Dialog>
      <DialogTrigger disabled={editor.isEmpty} asChild>
        <Button variant="outline">
          <CloudUpload />
          保存
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <div className="mb-6 border-b pb-4">
            <h2 className="text-center text-2xl font-semibold">文章信息</h2>
          </div>
        </DialogTitle>
        <ScrollArea className="container mx-auto max-h-[80vh] w-full max-w-[720px]">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
