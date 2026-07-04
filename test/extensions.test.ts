import { describe, it, expect } from "vitest";
import { extensions } from "@/components/tiptap/extension";

describe("extensions registry", () => {
  it("loads all extensions without throwing", () => {
    expect(() => extensions).not.toThrow();
    expect(extensions.length).toBeGreaterThan(0);
  });

  it("does not include the default Image extension (name: image)", () => {
    const hasDefaultImage = extensions.some(ext => {
      const name = (ext as { name?: string }).name;
      return name === "image";
    });
    expect(hasDefaultImage).toBe(false);
  });

  it("includes imageBlock as a block node", () => {
    const imageBlock = extensions.find(ext => {
      const name = (ext as { name?: string }).name;
      return name === "imageBlock";
    });
    expect(imageBlock).toBeDefined();
  });

  it("includes Placeholder extension", () => {
    const placeholder = extensions.find(ext => {
      const name = (ext as { name?: string }).name;
      return name === "placeholder";
    });
    expect(placeholder).toBeDefined();
  });

  it("includes CharacterCount extension", () => {
    const charCount = extensions.find(ext => {
      const name = (ext as { name?: string }).name;
      return name === "characterCount";
    });
    expect(charCount).toBeDefined();
  });

  it("includes SlashCommand extension", () => {
    const slash = extensions.find(ext => {
      const name = (ext as { name?: string }).name;
      return name === "slashCommand";
    });
    expect(slash).toBeDefined();
  });
});
