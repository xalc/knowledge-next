import StarterKit from "@tiptap/starter-kit";
import Heading from "@/components/tiptap/Heading";

import { cx } from "class-variance-authority";
// import { lowlight } from 'lowlight/lib/core';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { SlashCommand } from "./SlashCommand";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Details from "@tiptap-pro/extension-details";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Image from "@tiptap/extension-image";
import ImageUpload from "./extensions/ImageUpload/ImageUpload";
import { ImageBlock } from "./extensions/ImageBlock";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@/components/tiptap/link";
import { CodeBlock } from "./codeblock";
const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});
const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc  leading-5 ml-4 pl-4"),
    },
  },

  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal  leading-5 ml-4 pl-4"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("m-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx(" border-primary mt-6 border-l-4 pl-6 italic"),
    },
  },

  code: {
    HTMLAttributes: {
      class: cx(
        "relative rounded bg-primary/20 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      ),
      spellcheck: "false",
    },
  },
  horizontalRule: {
    HTMLAttributes: {
      class: "border-t-4",
    },
  },
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});
export const extensions = [
  starterKit.configure({
    document: false,
    heading: false,
    paragraph: false,
    codeBlock: false,
  }),
  Heading,
  taskList,
  taskItem,
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: "py-2",
    },
  }),
  Details.configure({
    persist: true,
    // openClassName: "border-primary mt-6 border-l-4 pl-6 italic",
    HTMLAttributes: {
      class: "border-primary mt-6",
    },
  }),
  DetailsContent,
  DetailsSummary,
  Image,
  ImageUpload,
  ImageBlock,
  CharacterCount.configure({
    limit: 100000,
    wordCounter: text => {
      const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      const englishWords = text.split(/\s+/).filter(word => word.trim() !== "");
      const englishCount = englishWords.length;
      return chineseCount + englishCount;
    },
  }),
  CodeBlock,
  Link,
  SlashCommand,
];
