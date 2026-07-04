import { describe, it, expect } from "vitest";
import { Editor } from "@tiptap/core";
import { extensions } from "@/components/tiptap/extension";

function createEditor() {
  return new Editor({
    extensions,
    content: "<p></p>",
    immediatelyRender: false,
  });
}

describe("CharacterCount word counter", () => {
  it("counts Chinese characters individually", () => {
    const editor = createEditor();
    editor.commands.insertContent("你好世界");
    expect(editor.storage.characterCount.words()).toBe(4);
    editor.destroy();
  });

  it("counts English words by whitespace", () => {
    const editor = createEditor();
    editor.commands.insertContent("hello world");
    expect(editor.storage.characterCount.words()).toBe(2);
    editor.destroy();
  });

  it("counts mixed Chinese + English", () => {
    const editor = createEditor();
    editor.commands.insertContent("你好 world");
    expect(editor.storage.characterCount.words()).toBe(2);
    editor.destroy();
  });

  it("counts single Chinese character as 1", () => {
    const editor = createEditor();
    editor.commands.insertContent("中");
    expect(editor.storage.characterCount.words()).toBe(1);
    editor.destroy();
  });

  it("counts empty content as 0", () => {
    const editor = createEditor();
    expect(editor.storage.characterCount.words()).toBe(0);
    editor.destroy();
  });

  it("counts characters correctly", () => {
    const editor = createEditor();
    editor.commands.insertContent("hello");
    expect(editor.storage.characterCount.characters()).toBe(5);
    editor.destroy();
  });
});
