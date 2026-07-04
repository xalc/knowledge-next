import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "@/components/blogs/editor-toolbar";

function createEditor() {
  return new Editor({
    extensions: [Document, Paragraph, Text, StarterKit.configure({ document: false })],
    content: "<p>hello world</p>",
    immediatelyRender: false,
  });
}

describe("EditorToolbar", () => {
  it("renders nothing when editor is null", () => {
    const { container } = render(<EditorToolbar editor={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders toolbar buttons when editor is provided", () => {
    const editor = createEditor();
    render(<EditorToolbar editor={editor} />);
    // The toolbar has buttons with tooltips
    expect(screen.getByText("撤销")).toBeInTheDocument();
    expect(screen.getByText("重做")).toBeInTheDocument();
    expect(screen.getByText("粗体")).toBeInTheDocument();
    editor.destroy();
  });

  it("toggles bold on click", async () => {
    const editor = createEditor();
    render(<EditorToolbar editor={editor} />);
    // Select all text first
    editor.commands.selectAll();
    const boldButton = screen.getByText("粗体").closest("button")!;
    await userEvent.click(boldButton);
    expect(editor.isActive("bold")).toBe(true);
    editor.destroy();
  });

  it("toggles heading level 1", async () => {
    const editor = createEditor();
    render(<EditorToolbar editor={editor} />);
    editor.commands.selectAll();
    const h1Button = screen.getByText("一级标题").closest("button")!;
    await userEvent.click(h1Button);
    expect(editor.isActive("heading", { level: 1 })).toBe(true);
    editor.destroy();
  });
});
