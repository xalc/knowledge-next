"use client";

import { useState, useCallback, useRef, ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";

import { useLocalStorage } from "usehooks-ts";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/blogs/blog-tag-input";
import { saveArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  Settings2,
  Loader2,
  CloudUpload,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  ChevronDown,
} from "lucide-react";
import EditorToolbar from "@/components/blogs/editor-toolbar";
import { EditorBubbleMenu } from "@/components/blogs/editor-menus";
import { ImageBlockMenu } from "@/components/blogs/image-block-menu";

interface ArticleMeta {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  author: string;
  cover: string;
}

const defaultMeta: ArticleMeta = {
  title: "",
  slug: "",
  description: "",
  tags: [],
  author: "HunterX",
  cover: "",
};

const Tiptap = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage<object | null>(
    "ttcontent-json",
    null,
  );
  const [metaValue, setMetaValue, removeMetaValue] = useLocalStorage<ArticleMeta>(
    "ttmeta-json",
    defaultMeta,
  );

  const [deBouncedValue] = useDebounce(storageValue, 1000);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const debouncedUpdates = (editor: { getJSON: () => object }) => {
    const json = editor.getJSON();
    if (JSON.stringify(deBouncedValue) !== JSON.stringify(json)) {
      setStorageValue(json);
    }
  };

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdates(editor);
    },
    content: deBouncedValue,
    immediatelyRender: false,
  });

  // 封面上传
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(metaValue.cover || "");
  const uploadAbortRef = useRef<AbortController | null>(null);

  const cancelCoverUpload = useCallback(() => {
    uploadAbortRef.current?.abort();
    setIsUploading(false);
    uploadAbortRef.current = null;
  }, []);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file) return;
      uploadAbortRef.current = new AbortController();
      try {
        setIsUploading(true);
        const result = await upload(`tt_images/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          abortSignal: uploadAbortRef.current?.signal,
        });
        if (uploadAbortRef.current?.signal.aborted) return;
        setPreviewUrl(result.url);
        setMetaValue({ ...metaValue, cover: result.url });
        toast({ title: "上传成功", description: "封面图片已上传" });
      } catch (error: unknown) {
        const err = error as { name?: string; message?: string };
        if (err?.name === "AbortError" || uploadAbortRef.current?.signal.aborted) return;
        toast({ title: "上传失败", description: err?.message || "图片上传失败，请重试" });
      } finally {
        setIsUploading(false);
        uploadAbortRef.current = null;
      }
    },
    [metaValue, setMetaValue, toast],
  );

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
      }
    },
    [handleImageUpload],
  );

  const clearCoverImage = useCallback(() => {
    setPreviewUrl("");
    setMetaValue({ ...metaValue, cover: "" });
  }, [metaValue, setMetaValue]);

  const updateMeta = (field: keyof ArticleMeta, value: string | string[]) => {
    setMetaValue({ ...metaValue, [field]: value });
  };

  const handlePublish = async () => {
    if (!editor) return;
    if (!metaValue.title.trim()) {
      toast({ title: "请输入标题", description: "标题不能为空" });
      return;
    }
    if (editor.isEmpty) {
      toast({ title: "内容为空", description: "请先写一些内容" });
      return;
    }

    let resp = null;
    try {
      setIsPublishing(true);
      resp = await saveArticleAction(JSON.stringify(editor.getJSON()), JSON.stringify(metaValue));
    } catch (err) {
      console.error(`error publish blog ${err}`);
    } finally {
      setIsPublishing(false);
      toast({ title: String(resp?.code ?? "错误"), description: resp?.message ?? "发布失败" });
      if (resp?.code === 200) {
        removeStorageValue();
        removeMetaValue();
        router.push("/blogs");
      }
    }
  };

  const reset = () => {
    removeStorageValue();
    removeMetaValue();
    setPreviewUrl("");
    editor?.commands.clearContent();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-[720px] px-6 py-8">
      {/* 顶部操作栏：只有发布和清空 */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
          <Trash2 className="mr-1 h-4 w-4" />
          清空
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing} size="sm">
          {isPublishing ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              发布中...
            </>
          ) : (
            <>
              <CloudUpload className="mr-1 h-4 w-4" />
              发布
            </>
          )}
        </Button>
      </div>

      {/* 标题：大号无框，写作焦点 */}
      <input
        value={metaValue.title}
        onChange={e => updateMeta("title", e.target.value)}
        placeholder="标题"
        className="w-full bg-transparent text-4xl font-bold leading-tight text-foreground outline-none placeholder:text-muted-foreground/40"
        autoComplete="off"
      />

      {/* 编辑器：紧跟标题，无多余间距 */}
      <EditorBubbleMenu editor={editor} />
      <ImageBlockMenu editor={editor} />

      {/* 工具栏：浮动在编辑器上方， sticky */}
      <div className="sticky top-0 z-30 -mx-6 my-3 border-b bg-background/80 px-6 py-2 backdrop-blur">
        <EditorToolbar editor={editor} />
      </div>

      <EditorContent editor={editor} />

      {/* 字数统计 */}
      <div className="mt-8 border-t pt-4 text-sm text-muted-foreground">
        {editor.storage.characterCount.words()} 字 · 约{" "}
        {Math.max(1, Math.round(editor.storage.characterCount.words() / 200))} 分钟阅读
      </div>

      {/* 可折叠的设置面板 */}
      <div className="mt-8 border-t">
        <button
          type="button"
          onClick={() => setShowSettings(v => !v)}
          className="flex w-full items-center gap-2 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="h-4 w-4" />
          文章设置
          <ChevronDown
            className={cn("ml-auto h-4 w-4 transition-transform", showSettings && "rotate-180")}
          />
        </button>

        {showSettings && (
          <div className="space-y-5 pb-6">
            {/* 描述 */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">描述</label>
              <Input
                value={metaValue.description}
                onChange={e => updateMeta("description", e.target.value)}
                placeholder="简短描述文章的主要内容..."
                className="h-9"
                autoComplete="off"
              />
            </div>

            {/* URL 别名 + 作者 */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-1 items-center gap-2">
                <span className="text-xs text-muted-foreground">/blogs/</span>
                <Input
                  value={metaValue.slug}
                  onChange={e => updateMeta("slug", e.target.value)}
                  placeholder="article-url-name"
                  className="h-9"
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">作者</span>
                <Input
                  value={metaValue.author}
                  onChange={e => updateMeta("author", e.target.value)}
                  className="h-9 w-28"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* 标签 */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">标签</label>
              <TagInput
                value={metaValue.tags}
                onChange={tags => updateMeta("tags", tags)}
                className="space-y-2"
              />
            </div>

            {/* 封面图片 */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                封面图片
              </label>
              {previewUrl ? (
                <div className="relative w-full max-w-sm overflow-hidden rounded-md border border-border">
                  <div className="relative aspect-video w-full">
                    <Image src={previewUrl} alt="文章封面" fill className="object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1"
                    onClick={clearCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex w-full max-w-sm flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-4 transition-colors",
                    isUploading && "opacity-70",
                  )}
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
                    <div className="text-xs text-muted-foreground">
                      {isUploading ? "正在上传..." : "点击上传封面"}
                    </div>
                    {isUploading ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={cancelCoverUpload}
                      >
                        <X className="mr-1 h-4 w-4" />
                        取消
                      </Button>
                    ) : (
                      <>
                        <input
                          type="file"
                          id="cover-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={onFileChange}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById("cover-upload")?.click()}
                        >
                          <Upload className="mr-1 h-4 w-4" />
                          选择图片
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tiptap;
