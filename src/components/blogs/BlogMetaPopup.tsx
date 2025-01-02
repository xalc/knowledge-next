import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BlogMetaPopup({ children, editor }) {
  return (
    <Dialog>
      <DialogTrigger disabled={editor.isEmpty} asChild><Button >Save it</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}