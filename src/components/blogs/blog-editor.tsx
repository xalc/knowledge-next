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
import { Pencil, PencilOff, Calendar, Clock, BarChart2, CalendarCheck, Trash2 } from "lucide-react";
import { ToC } from "./toc";
import EditorToolbar from "./editor-toolbar";
import { deleteArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BlogEditor = ({ post }) => {
  const user = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [editable, setEditable] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  const updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt);
  const createdDateLabel = Number.isNaN(createdAt.getTime())
    ? "—"
    : createdAt.toLocaleDateString("zh-CN");
  const updatedDateLabel = Number.isNaN(updatedAt.getTime())
    ? "—"
    : updatedAt.toLocaleDateString("zh-CN");

  const editor = useEditor({
    editable: editable,
    immediatelyRender: false,
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
        class: clsx("focus:outline-none py-4", editable && "border-2 rounded-lg p-4"),
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const resp = await deleteArticleAction(post.id);
      toast({
        title: resp.code === 200 ? "成功" : "失败",
        description: resp.message,
      });
      if (resp.code === 200) {
        router.push("/blogs");
      }
    } catch {
      toast({ title: "错误", description: "删除失败" });
    } finally {
      setIsDeleting(false);
    }
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
              创建于{createdDateLabel}
            </span>
            {createdDateLabel !== updatedDateLabel && (
              <span className="inline-flex items-center gap-1">
                <CalendarCheck className="h-4 w-4" />
                修改于{updatedDateLabel}
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              {editor.storage.characterCount.words()} 字
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />约{" "}
              {Math.max(1, Math.round(editor.storage.characterCount.words() / 200))} 分钟阅读
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
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={editContent} disabled={!user.isAuth}>
                    {editable ? (
                      <PencilOff className="mr-1 h-4 w-4" />
                    ) : (
                      <Pencil className="mr-1 h-4 w-4" />
                    )}
                    {editable ? "退出编辑" : "编辑"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{editable ? "切换到只读模式" : "切换到编辑模式"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {editable && (
              <BlogMetaPopup editor={editor}>
                <BlogMetaForm content={JSON.stringify(editor.getJSON())} meta={post} />
              </BlogMetaPopup>
            )}
            {user.isAuth && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    删除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除文章？</AlertDialogTitle>
                    <AlertDialogDescription>
                      将永久删除「{post.title}」，此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "删除中..." : "确认删除"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}

        {editable && (
          <div className="sticky top-16 z-40">
            <EditorToolbar editor={editor} />
          </div>
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
