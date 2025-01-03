"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { saveArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
// interface BlogMeta extends z.infer<typeof formSchema> {

//   metadata: {
//     tags: string[];
//   };
// }
/* eslint-disable-next-line */
export function BlogMetaForm({ content, meta }: { content: string; meta?: any }) {
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

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });
  const router = useRouter();
  const [isPending, setPending] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setPending(true);
      await saveArticleAction(content, JSON.stringify({ ...meta, ...values }));
    } catch (err) {
      console.error(`error submit blog ${err}`);
    } finally {
      router.push("/blogs");
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-8 space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>title</FormLabel>
              <FormControl>
                <Input placeholder="article title" {...field} autoComplete="off" />
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="the name shown on url" {...field} autoComplete="off" />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Input placeholder="Description" autoComplete="off" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel>Article tags</FormLabel>
        <div className="flex flex-wrap gap-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              name={`tags.${index}`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="add tag" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    delete
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button type="button" onClick={() => append("")}>
            Add tag
          </Button>
        </div>

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="ahthor" autoComplete="off" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isPending ? "submiting..." : "submit"}</Button>
      </form>
    </Form>
  );
}
