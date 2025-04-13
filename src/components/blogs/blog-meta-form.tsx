"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { useState, useCallback, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { TagInput } from "./blog-tag-input";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  slug: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  cover: z.string().optional(),
  id: z.string().optional(),
});

/* eslint-disable-next-line */
export function BlogMetaForm({ content, meta }: { content: string; meta?: any }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: meta?.title || "",
      slug: meta?.slug || "",
      description: meta?.description || "",
      author: meta?.author || "HunterX",
      tags: meta?.metadata?.tags || [],
      cover: meta?.cover || "",
    },
  });

  const router = useRouter();
  const [isPending, setPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(meta?.cover || "");

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      try {
        setIsUploading(true);
        const result = await upload(`tt_images/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        setPreviewUrl(result.url);
        form.setValue("cover", result.url);
        toast({
          title: "上传成功",
          description: "封面图片已上传",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast({
          title: "上传失败",
          description: error.message || "图片上传失败，请重试",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [form, toast],
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
    form.setValue("cover", "");
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let resp = null;
    try {
      setPending(true);
      resp = await saveArticleAction(content, JSON.stringify({ ...meta, ...values }));
    } catch (err) {
      console.error(`error submit blog ${err}`);
    } finally {
      setPending(false);
      toast({
        title: resp.code,
        description: resp.message,
      });
      if (resp.code === 200) {
        router.push("/blogs");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* 表单字段区域 */}
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">标题</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入文章标题"
                    {...field}
                    className="h-11"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">URL 别名</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-muted-foreground">/blogs/</span>
                    <Input
                      placeholder="article-url-name"
                      {...field}
                      className="h-11"
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
                <FormDescription>这将作为文章的永久链接地址</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">描述</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="简短描述文章的主要内容..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel className="text-base font-medium">文章标签</FormLabel>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">作者</FormLabel>
                <FormControl>
                  <Input {...field} className="h-11" autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">封面图片</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
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
                            {isUploading ? "正在上传..." : "拖放图片或点击上传"}
                          </div>
                          <input
                            type="file"
                            id="cover-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={onFileChange}
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => document.getElementById("cover-upload")?.click()}
                          >
                            <Upload className="mr-1 h-4 w-4" />
                            选择图片
                          </Button>
                        </div>
                      </div>
                    )}
                    <input type="hidden" {...field} />
                  </div>
                </FormControl>
                <FormDescription>上传文章封面图片（可选）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 操作按钮区域 */}
        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            重置
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[100px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
