"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";

import { useLocalStorage } from "usehooks-ts";
import { useDebounce } from "use-debounce";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";

import { BlogMetaForm } from "@/components/blogs/blog-meta-form";

import BlogMetaPopup from "@/components/blogs/blog-meta-popup";
import { BellRing, FileJson, FileCode, Trash2, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EditorToolbar from "@/components/blogs/editor-toolbar";

const Tiptap = () => {
  const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage("ttcontent", null);

  const [deBouncedValue] = useDebounce(storageValue, 1000);
  const debouncedUpdates = editor => {
    if (deBouncedValue !== editor.getHTML()) {
      setStorageValue(editor.getHTML());
    }
  };
  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder: "开始写作... 输入 / 可插入各种内容块",
      }),
    ],
    editorProps: {
      attributes: {
        class: "mx-12 my-8 p-4 focus:outline-none border-2 rounded-lg min-h-[600px]",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdates(editor);
    },
    content: deBouncedValue,
    immediatelyRender: false,
  });
  if (!editor) {
    return null;
  }
  const handleExport = (jsonFormat: boolean = true) => {
    const content = jsonFormat ? editor.getJSON() : editor.getHTML();
    const type = jsonFormat ? "application/json" : "text/html";
    const name = jsonFormat ? "article.json" : "article.html";
    const blob = new Blob([JSON.stringify(content, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    removeStorageValue();
    editor.commands.clearContent();
  };

  return (
    <div className="lg: container mx-auto max-w-[1024px]">
      <div className="mx-12 mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">新文章</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <BlogMetaPopup editor={editor}>
            <BlogMetaForm content={JSON.stringify(editor.getJSON())} />
          </BlogMetaPopup>
          <Button
            variant="outline"
            size="sm"
            disabled={editor.isEmpty}
            onClick={() => handleExport(true)}
          >
            <FileJson className="mr-1 h-4 w-4" />
            导出 JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={editor.isEmpty}
            onClick={() => handleExport(false)}
          >
            <FileCode className="mr-1 h-4 w-4" />
            导出 HTML
          </Button>
          <Button variant="destructive" size="sm" disabled={editor.isEmpty} onClick={reset}>
            <Trash2 className="mr-1 h-4 w-4" />
            清空
          </Button>
        </div>
      </div>

      <Alert className="mx-12 mt-4 w-auto bg-primary/5">
        <BellRing className="h-4 w-4" />
        <AlertDescription>
          内容自动保存到本地浏览器，下次访问不会丢失。登录后可发布到线上。
        </AlertDescription>
      </Alert>

      <div className="mx-12 mt-4">
        <EditorToolbar editor={editor} />
      </div>

      <EditorContent editor={editor} />

      <div className="mx-12 mb-8 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
        <span>{editor.storage.characterCount.words()} 字</span>
        <span>
          约 {Math.max(1, Math.round(editor.storage.characterCount.words() / 200))} 分钟阅读
        </span>
      </div>
    </div>
  );
};

export default Tiptap;
