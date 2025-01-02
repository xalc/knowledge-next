'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from '@/components/tiptap/extension'

import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { useLocalStorage } from 'usehooks-ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BlogMetaForm } from './BlogmetaForm';

const BlogEditor = ({ post }) => {
  const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage('blogpost', null)
  const user = useContext(UserContext);
  const [editable, setEditable] = useState(false)
  const editor = useEditor({
    editable: editable,
    extensions: [...extensions],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    content: post.postcontent.content,
  })
  const editContent = () => {
    setEditable(e => {
      editor.setEditable(!e);
      return !e
    })
  }
  if (!editor) {
    return null
  }
  return <>
    {/* {user && <Button variant='link' onClick={editContent} disabled={!user.isAuth}>Edit</Button>}
    {user && editable && <Dialog>
      <DialogTrigger asChild><Button >Save it</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add meta infomation</DialogTitle>
          <BlogMetaForm content={JSON.stringify(editor.getJSON())} meta={post} />
        </DialogHeader>
      </DialogContent>
    </Dialog>} */}
    <EditorContent editor={editor} />
  </>
}
export default BlogEditor;