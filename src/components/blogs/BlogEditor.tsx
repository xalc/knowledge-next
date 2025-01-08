"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/components/tiptap/extension";

import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { BlogMetaForm } from "./BlogmetaForm";
import BlogMetaPopup from "./BlogMetaPopup";
import { DialogTitle } from "@/components/ui/dialog";

import { Pencil, PencilOff } from "lucide-react";
const BlogEditor = ({ post }) => {
  const user = useContext(UserContext);
  const [editable, setEditable] = useState(false);
  const editor = useEditor({
    editable: editable,
    extensions: [...extensions],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
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
    <div className="w-full overflow-x-hidden">
      {user && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" onClick={editContent} disabled={!user.isAuth}>
                {editable ? <PencilOff /> : <Pencil />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{editable ? "只读" : "编辑"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {user && editable && (
        <BlogMetaPopup editor={editor}>
          <DialogTitle>Edit meta infomation</DialogTitle>
          <BlogMetaForm content={JSON.stringify(editor.getJSON())} meta={post} />
        </BlogMetaPopup>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
export default BlogEditor;
