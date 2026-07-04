"use client";

import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageBlockWidth } from "@/components/tiptap/extensions/ImageBlock/components/ImageBlockWidth";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

/** 图片选中时浮出的宽度/对齐控制栏 */
export function ImageBlockMenu({ editor }: { editor: Editor }) {
  if (!editor.isActive("imageBlock")) return null;

  const widthStr = editor.getAttributes("imageBlock").width as string;
  const width = parseInt(widthStr) || 100;
  const align = (editor.getAttributes("imageBlock").align as string) || "center";

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={() => editor.isActive("imageBlock")}
      tippyOptions={{ duration: 100, placement: "top" }}
      className="flex items-center gap-2 rounded-lg border bg-background p-1.5 shadow-md"
    >
      <ImageBlockWidth
        value={width}
        onChange={v => editor.chain().focus().setImageBlockWidth(v).run()}
      />
      <div className="flex items-center gap-0.5 border-l pl-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", align === "left" && "bg-primary/15 text-primary")}
          onClick={() => editor.chain().focus().setImageBlockAlign("left").run()}
          title="左对齐"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", align === "center" && "bg-primary/15 text-primary")}
          onClick={() => editor.chain().focus().setImageBlockAlign("center").run()}
          title="居中"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", align === "right" && "bg-primary/15 text-primary")}
          onClick={() => editor.chain().focus().setImageBlockAlign("right").run()}
          title="右对齐"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
    </BubbleMenu>
  );
}
