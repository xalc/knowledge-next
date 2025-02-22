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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { TagInput } from "./blog-tag-input";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  slug: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
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
    },
  });

  const router = useRouter();
  const [isPending, setPending] = useState(false);

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
