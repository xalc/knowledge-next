import { describe, it, expect } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { ImageBlock } from "@/components/tiptap/extensions/ImageBlock";

function createEditor() {
  return new Editor({
    extensions: [Document, Paragraph, Text, ImageBlock],
    content: "<p></p>",
    immediatelyRender: false,
  });
}

describe("ImageBlock extension", () => {
  it("parseHTML matches any img[src] not data URI", () => {
    const editor = createEditor();
    // Insert HTML with a normal image
    editor.commands.setContent('<img src="https://example.com/test.png">');
    const json = editor.getJSON();
    const hasImageBlock = JSON.stringify(json).includes("imageBlock");
    expect(hasImageBlock).toBe(true);
    editor.destroy();
  });

  it("does not match data URI images", () => {
    const editor = createEditor();
    editor.commands.setContent('<img src="data:image/png;base64,abc123">');
    const json = editor.getJSON();
    const hasImageBlock = JSON.stringify(json).includes("imageBlock");
    expect(hasImageBlock).toBe(false);
    editor.destroy();
  });

  it("setImageBlock inserts an imageBlock node", () => {
    const editor = createEditor();
    editor.commands.setImageBlock({ src: "https://example.com/img.jpg" });
    const json = editor.getJSON();
    const jsonStr = JSON.stringify(json);
    expect(jsonStr).toContain("imageBlock");
    expect(jsonStr).toContain("https://example.com/img.jpg");
    editor.destroy();
  });

  it("setImageBlockWidth clamps 0-100 and appends %", () => {
    const editor = createEditor();
    editor.commands.setImageBlock({ src: "https://example.com/img.jpg" });
    // Value within range
    editor.commands.setImageBlockWidth(50);
    let json = editor.getJSON();
    let imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.width).toBe("50%");

    // Value above range -> clamped to 100
    editor.commands.setImageBlockWidth(150);
    json = editor.getJSON();
    imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.width).toBe("100%");

    // Value below range -> clamped to 0
    editor.commands.setImageBlockWidth(-10);
    json = editor.getJSON();
    imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.width).toBe("0%");
    editor.destroy();
  });

  it("setImageBlockAlign updates align attribute", () => {
    const editor = createEditor();
    editor.commands.setImageBlock({ src: "https://example.com/img.jpg" });

    editor.commands.setImageBlockAlign("left");
    let json = editor.getJSON();
    let imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.align).toBe("left");

    editor.commands.setImageBlockAlign("right");
    json = editor.getJSON();
    imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.align).toBe("right");

    editor.destroy();
  });

  it("default width is 100% and default align is center", () => {
    const editor = createEditor();
    editor.commands.setImageBlock({ src: "https://example.com/img.jpg" });
    const json = editor.getJSON();
    const imgNode = findImageBlockNode(json);
    expect(imgNode?.attrs?.width).toBe("100%");
    expect(imgNode?.attrs?.align).toBe("center");
    editor.destroy();
  });
});

function findImageBlockNode(
  doc: object,
): { attrs?: { width?: string; align?: string } } | undefined {
  const docObj = doc as { content?: Array<{ type: string; attrs?: object }> };
  return docObj.content?.find(node => node.type === "imageBlock");
}
