'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from '@/components/tiptap/extension'

const TiptapEditor = ({ content }) => {
  const editor = useEditor({
    editable: false,
    extensions: [...extensions],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },

    content: content,
  })
  if (!editor) {
    return null
  }
  return <EditorContent editor={editor} />
}
export default TiptapEditor;