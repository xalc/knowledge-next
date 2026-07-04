import { describe, it, expect } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@/components/tiptap/link";

function createEditor() {
  return new Editor({
    extensions: [Document, Paragraph, Text, Link],
    content: "<p></p>",
    immediatelyRender: false,
  });
}

describe("Link extension sanitization", () => {
  it("strips javascript: href in renderHTML", () => {
    const editor = createEditor();
    editor.commands.setContent('<a href="javascript:alert(1)">click</a>');
    const html = editor.getHTML();
    // The javascript: href should be stripped (empty href)
    expect(html).not.toContain("javascript:alert(1)");
    editor.destroy();
  });

  it("parseHTML rejects javascript: links", () => {
    const editor = createEditor();
    editor.commands.setContent('<a href="javascript:alert(1)">click</a>');
    const json = editor.getJSON();
    const jsonStr = JSON.stringify(json);
    // Should not create a link mark with javascript: href
    expect(jsonStr).not.toContain("javascript:alert(1)");
    editor.destroy();
  });

  it("allows normal https links", () => {
    const editor = createEditor();
    editor.commands.setContent('<a href="https://example.com">click</a>');
    const html = editor.getHTML();
    expect(html).toContain("https://example.com");
    expect(html).toContain("link");
    editor.destroy();
  });

  it("setLink command works with normal URLs", () => {
    const editor = createEditor();
    editor.commands.insertContent("hello");
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.setLink({ href: "https://example.com" });
    expect(editor.isActive("link")).toBe(true);
    const html = editor.getHTML();
    expect(html).toContain("https://example.com");
    editor.destroy();
  });

  it("unsetLink removes the link mark", () => {
    const editor = createEditor();
    editor.commands.insertContent("hello");
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.setLink({ href: "https://example.com" });
    editor.commands.unsetLink();
    expect(editor.isActive("link")).toBe(false);
    editor.destroy();
  });
});
