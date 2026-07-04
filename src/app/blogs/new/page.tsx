"use client";

import { useState, useCallback, useRef, ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";

import { useLocalStorage } from "usehooks-ts";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/blogs/blog-tag-input";
import { saveArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  BellRing,
  FileJson,
  FileCode,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CloudUpload,
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
  const [showAutosaveHint, setShowAutosaveHint] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // 内容 + 元数据分别持久化到 localStorage
  const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage<object | null>(
    "ttcontent-json",
    null,
  );
  const [metaValue, setMetaValue, removeMetaValue] = useLocalStorage<ArticleMeta>(
    "ttmeta-json",
    defaultMeta,
  );

  const [deBouncedValue] = useDebounce(storageValue, 1000);
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
        class: "mx-12 my-8 p-4 focus:outline-none border-2 rounded-lg min-h-[600px]",
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

  // 发布
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

  const handleExport = (jsonFormat: boolean = true) => {
    if (!editor) return;
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
    removeMetaValue();
    setPreviewUrl("");
    editor?.commands.clearContent();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-[1024px]">
      {/* 顶部操作栏 */}
      <div className="mx-12 mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">新文章</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePublish} disabled={isPublishing} className="min-w-[80px]">
            {isPublishing ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                发布中...
              </>
            ) : (
              "发布"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={editor.isEmpty}
            onClick={() => handleExport(true)}
          >
            <FileJson className="mr-1 h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={editor.isEmpty}
            onClick={() => handleExport(false)}
          >
            <FileCode className="mr-1 h-4 w-4" />
            HTML
          </Button>
          <Button variant="destructive" size="sm" disabled={editor.isEmpty} onClick={reset}>
            <Trash2 className="mr-1 h-4 w-4" />
            清空
          </Button>
        </div>
      </div>

      {/* 自动保存提示 */}
      {showAutosaveHint && (
        <div className="relative mx-12 mt-4 flex items-center gap-3 rounded-lg border bg-primary/5 px-4 py-2 pr-12 text-sm">
          <BellRing className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 leading-5 text-muted-foreground">
            内容和标题自动保存到本地浏览器，下次访问不会丢失。
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:bg-primary/10"
            onClick={() => setShowAutosaveHint(false)}
            title="关闭提示"
            aria-label="关闭提示"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* 文章元信息区域 */}
      <div className="mx-12 mt-4 space-y-5 rounded-lg border bg-card p-6">
        {/* 标题 */}
        <Input
          value={metaValue.title}
          onChange={e => updateMeta("title", e.target.value)}
          placeholder="文章标题"
          className="h-12 border-none px-0 text-2xl font-bold shadow-none focus-visible:ring-0"
          autoComplete="off"
        />

        {/* 描述 */}
        <Textarea
          value={metaValue.description}
          onChange={e => updateMeta("description", e.target.value)}
          placeholder="简短描述文章的主要内容..."
          rows={2}
          className="resize-none border-none px-0 text-base text-muted-foreground shadow-none focus-visible:ring-0"
        />

        {/* 分割线 */}
        <div className="border-t" />

        {/* URL 别名 + 作者 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm text-muted-foreground">/blogs/</span>
            <Input
              value={metaValue.slug}
              onChange={e => updateMeta("slug", e.target.value)}
              placeholder="article-url-name"
              className="h-9"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">作者</span>
            <Input
              value={metaValue.author}
              onChange={e => updateMeta("author", e.target.value)}
              className="h-9 w-32"
              autoComplete="off"
            />
          </div>
        </div>

        {/* 标签 */}
        <div className="space-y-2">
          <TagInput
            value={metaValue.tags}
            onChange={tags => updateMeta("tags", tags)}
            className="space-y-2"
          />
        </div>

        {/* 封面图片 */}
        <div className="space-y-2">
          {previewUrl ? (
            <div className="relative w-full max-w-md overflow-hidden rounded-md border border-border">
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
                "flex aspect-video w-full max-w-md flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-4 transition-colors",
                isUploading && "opacity-70",
              )}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                <div className="text-sm font-medium text-muted-foreground">
                  {isUploading ? "正在上传..." : "拖放图片或点击上传封面"}
                </div>
                {isUploading ? (
                  <Button type="button" variant="secondary" size="sm" onClick={cancelCoverUpload}>
                    <X className="mr-1 h-4 w-4" />
                    取消上传
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

      {/* 编辑器工具栏 */}
      <div className="mx-12 mt-4">
        <EditorToolbar editor={editor} />
      </div>

      <EditorBubbleMenu editor={editor} />
      <ImageBlockMenu editor={editor} />
      <EditorContent editor={editor} />

      {/* 字数统计 */}
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
