'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from '@/components/tiptap/extension'

import { useLocalStorage } from 'usehooks-ts'
import { useDebounce } from 'use-debounce';
import Placeholder from '@tiptap/extension-placeholder'

import { Button } from '@/components/ui/button';


import { BlogMetaForm } from '@/components/blogs/BlogmetaForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Tiptap = () => {
  const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage('ttcontent', null)

  const [deBouncedValue] = useDebounce(storageValue, 1000);
  const debouncedUpdates = (editor) => {
    if (deBouncedValue !== editor.getHTML()) {
      setStorageValue(editor.getHTML());
    }
  };
  const editor = useEditor({
    extensions: [...extensions,
    Placeholder.configure({
      // Use a placeholder:
      placeholder: '可以开始写作了... 试试斜杠'
    })
    ],
    editorProps: {
      attributes: {
        class: 'my-6 p-4 focus:outline-none border-2 min-h-[600px]',
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdates(editor);
    },
    content: deBouncedValue,
  })
  if (!editor) {
    return null
  }
  const handleExport = (jsonFormat: boolean = true) => {
    const content = jsonFormat ? editor.getJSON() : editor.getHTML();
    const type = jsonFormat ? 'application/json' : 'text/html';
    const name = jsonFormat ? 'article.json' : 'article.html';
    const blob = new Blob([JSON.stringify(content, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);

  }

  const reset = () => {
    removeStorageValue();
    editor.commands.clearContent();
  }

  return <>
    <div className='flex gap-4 justify-end'>
      <Dialog>
        <DialogTrigger asChild><Button disabled={editor.isEmpty} >Save it</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add meta infomation</DialogTitle>
            {/* 
              investigate why direct send json failed with heading node 
              tempory using json strings
             */}
            <BlogMetaForm content={JSON.stringify(editor.getJSON())} />

          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* <Button onClick={saveArticle}>Save it</Button> */}
      <Button disabled={editor.isEmpty} onClick={reset}>Empty Content</Button>
      <Button disabled={editor.isEmpty} onClick={() => handleExport(true)}>export JSON</Button>
      <Button disabled={editor.isEmpty} onClick={() => handleExport(false)}>export HTML</Button>
      <Button variant='outline'>{editor.storage.characterCount.words()} words</Button>
    </div>



    <EditorContent editor={editor} />



  </>
}

export default Tiptap