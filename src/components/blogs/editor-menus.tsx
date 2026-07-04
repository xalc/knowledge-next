"use client";

import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Italic, Strikethrough, Code, Heading1, Link as LinkIcon } from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

function MenuButton({ onClick, isActive, children, title }: MenuButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", isActive && "bg-primary/15 text-primary")}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );
}

/** 选中文字时浮出的轻量格式栏 */
export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("链接 URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-0.5 rounded-lg border bg-background p-1 shadow-md"
    >
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="粗体"
      >
        <Bold className="h-4 w-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="斜体"
      >
        <Italic className="h-4 w-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="删除线"
      >
        <Strikethrough className="h-4 w-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="行内代码"
      >
        <Code className="h-4 w-4" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="标题"
      >
        <Heading1 className="h-4 w-4" />
      </MenuButton>
      <MenuButton onClick={setLink} isActive={editor.isActive("link")} title="链接">
        <LinkIcon className="h-4 w-4" />
      </MenuButton>
    </BubbleMenu>
  );
}
