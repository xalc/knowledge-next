"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";

import { useLocalStorage } from "usehooks-ts";
import { useDebounce } from "use-debounce";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";

import { BlogMetaForm } from "@/components/blogs/BlogmetaForm";

import { DialogTitle } from "@/components/ui/dialog";
import BlogMetaPopup from "@/components/blogs/BlogMetaPopup";
import { BellRing } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        // Use a placeholder:
        placeholder: "可以开始写作了... 试试斜杠",
      }),
    ],
    editorProps: {
      attributes: {
        class: "mx-12 my-8 p-4 focus:outline-none border-2 min-h-[600px]",
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
      <div className="mx-12 mt-8 flex flex-wrap justify-end gap-4">
        <BlogMetaPopup editor={editor}>
          <DialogTitle>Add meta infomation</DialogTitle>
          <BlogMetaForm content={JSON.stringify(editor.getJSON())} />
        </BlogMetaPopup>
        <Button disabled={editor.isEmpty} onClick={reset}>
          Empty Content
        </Button>
        <Button disabled={editor.isEmpty} onClick={() => handleExport(true)}>
          export JSON
        </Button>
        <Button disabled={editor.isEmpty} onClick={() => handleExport(false)}>
          export HTML
        </Button>
        <Button variant="outline">{editor.storage.characterCount.words()} words</Button>
      </div>

      <Alert className="mx-12 mt-8 w-auto bg-primary/5">
        <BellRing className="h-4 w-4" />
        <AlertTitle>提醒</AlertTitle>
        <AlertDescription>
          可以在这里编辑，写作，也可以导出，内容临时存储在本地，下次同一设备访问不会丢失，但只有登陆后才能上传
        </AlertDescription>
      </Alert>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
