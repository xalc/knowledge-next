import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'

import { cx } from "class-variance-authority";

const lowlight = createLowlight(all)

export const CodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'javascript',
  HTMLAttributes: {
    class: cx(
      "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",

    ),
  }
})