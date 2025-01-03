import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
export default function BlogMetaPopup({ children, editor }) {
  return (
    <Dialog>
      <DialogTrigger disabled={editor.isEmpty} asChild>
        <Button>
          <CloudUpload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>{children}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
