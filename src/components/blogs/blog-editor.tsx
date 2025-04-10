"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BlogMetaForm } from "./blog-meta-form";
import BlogMetaPopup from "./blog-meta-popup";
import { clsx } from "clsx";
import { getHierarchicalIndexes, TableOfContents } from "@tiptap-pro/extension-table-of-contents";
import { Pencil, PencilOff, Calendar, Clock, BarChart2, CalendarCheck } from "lucide-react";
import { ToC } from "./toc";
const BlogEditor = ({ post }) => {
  const user = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [editable, setEditable] = useState(false);
  const editor = useEditor({
    editable: editable,
    extensions: [
      ...extensions,
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: clsx("focus:outline-none py-4", editable && "border-2"),
      },
    },
    content: post.postcontent.content,
  });
  const editContent = () => {
    setEditable(e => {
      editor.setEditable(!e);
      return !e;
    });
  };
  if (!editor) {
    return null;
  }
  return (
    <div className="mx-12 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_240px]">
      <div className="mb-8 space-y-4">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              创建于{post.createdAt.toLocaleDateString()}
            </span>
            {post.createdAt.toLocaleDateString() !== post.updatedAt.toLocaleDateString() && (
              <span className="inline-flex items-center gap-1">
                <CalendarCheck className="h-4 w-4" />
                修改于{post.updatedAt.toLocaleDateString()}
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              {editor.storage.characterCount.words()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {(editor.storage.characterCount.words() / 200).toFixed(0)}分钟阅读
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.metadata?.tags &&
              post.metadata.tags?.map((tag, index) => (
                <Badge
                  variant="secondary"
                  key={`tag_${index}`}
                  className="pointer-events-none whitespace-nowrap"
                >
                  {tag}
                </Badge>
              ))}
          </div>
          <h1 className="sticky text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="text-xl italic text-muted-foreground">{post.description}</p>
        </div>
        {user && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={editContent}
                  disabled={!user.isAuth}
                  className="mb-8 mr-8"
                >
                  {editable ? <PencilOff /> : <Pencil />} {editable ? "只读" : "编辑"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{editable ? "只读" : "编辑"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {user && editable && (
          <BlogMetaPopup editor={editor}>
            <BlogMetaForm content={JSON.stringify(editor.getJSON())} meta={post} />
          </BlogMetaPopup>
        )}
        {post.cover && (
          <div className="my-8 overflow-hidden border duration-1000 animate-in fade-in zoom-in">
            <div className="relative aspect-[2/1]">
              <Image
                src={post.cover}
                alt={post.title}
                className="object-cover"
                fill
                sizes={"w-full"}
                priority
              />
            </div>
          </div>
        )}
        <div className="space-y-10">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="hidden xl:block">
        <div className="sticky top-20">
          <ToC editor={editor} items={items} />
        </div>
      </div>
    </div>
  );
};
export default BlogEditor;
