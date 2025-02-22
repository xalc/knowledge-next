import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
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
        <ScrollArea className="container mx-auto max-h-[80vh] w-full max-w-[720px]">
          <DialogHeader>{children}</DialogHeader>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
