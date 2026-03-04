import { Group } from "./types";

export const GROUPS: Group[] = [
  {
    name: "format",
    title: "格式",
    commands: [
      {
        name: "heading1",
        label: "一级标题",
        iconName: "Heading1",
        description: "高优先级段落标题",
        aliases: ["h1", "heading1"],
        action: editor => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        name: "heading2",
        label: "二级标题",
        iconName: "Heading2",
        description: "中优先级段落标题",
        aliases: ["h2", "heading2"],
        action: editor => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: "heading3",
        label: "三级标题",
        iconName: "Heading3",
        description: "低优先级段落标题",
        aliases: ["h3", "heading3"],
        action: editor => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
      {
        name: "bulletList",
        label: "无序列表",
        iconName: "List",
        description: "无序的列表项目",
        aliases: ["ul", "list"],
        action: editor => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: "numberedList",
        label: "有序列表",
        iconName: "ListOrdered",
        description: "有序的列表项目",
        aliases: ["ol", "numbered"],
        action: editor => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        name: "taskList",
        label: "任务列表",
        iconName: "ListTodo",
        description: "带复选框的待办列表",
        aliases: ["todo", "task", "checkbox"],
        action: editor => {
          editor.chain().focus().toggleTaskList().run();
        },
      },
      {
        name: "toggleList",
        label: "折叠块",
        iconName: "ListCollapse",
        description: "可展开/折叠的内容块",
        aliases: ["toggle", "details", "collapse"],
        action: editor => {
          editor.chain().focus().setDetails().run();
        },
      },
      {
        name: "blockquote",
        label: "引用",
        iconName: "Quote",
        description: "引用文字或段落",
        aliases: ["quote", "blockquote"],
        action: editor => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        name: "codeBlock",
        label: "代码块",
        iconName: "SquareCode",
        description: "带语法高亮的代码块",
        aliases: ["code", "codeblock"],
        shouldBeHidden: editor => editor.isActive("columns"),
        action: editor => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
    ],
  },
  {
    name: "insert",
    title: "插入",
    commands: [
      {
        name: "image",
        label: "图片",
        iconName: "Image",
        description: "插入图片",
        aliases: ["img", "image", "picture"],
        action: editor => {
          editor.chain().focus().setImageUpload().run();
        },
      },
      {
        name: "horizontalRule",
        label: "分割线",
        iconName: "Minus",
        description: "插入水平分割线",
        aliases: ["hr", "divider", "line"],
        action: editor => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
    ],
  },
];

export default GROUPS;
