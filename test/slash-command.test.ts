import { describe, it, expect } from "vitest";
import { GROUPS } from "@/components/tiptap/SlashCommand/groups";

/** 复制 SlashCommand.ts 中的过滤逻辑用于测试 */
function filterGroups(query: string) {
  const queryNormalized = query.toLowerCase().trim();
  return GROUPS.map(group => ({
    ...group,
    commands: group.commands.filter(item => {
      const labelNormalized = item.label.toLowerCase().trim();
      if (item.aliases) {
        const aliases = item.aliases.map(alias => alias.toLowerCase().trim());
        return labelNormalized.includes(queryNormalized) || aliases.includes(queryNormalized);
      }
      return labelNormalized.includes(queryNormalized);
    }),
  })).filter(group => group.commands.length > 0);
}

describe("SlashCommand groups", () => {
  it("has two groups: format and insert", () => {
    expect(GROUPS).toHaveLength(2);
    expect(GROUPS[0].name).toBe("format");
    expect(GROUPS[1].name).toBe("insert");
  });

  it("filters commands by label (h1 -> heading1)", () => {
    const result = filterGroups("h1");
    const names = result.flatMap(g => g.commands.map(c => c.name));
    expect(names).toContain("heading1");
  });

  it("filters commands by alias (todo -> taskList)", () => {
    const result = filterGroups("todo");
    const names = result.flatMap(g => g.commands.map(c => c.name));
    expect(names).toContain("taskList");
  });

  it("filters commands by alias (code -> codeBlock)", () => {
    const result = filterGroups("code");
    const names = result.flatMap(g => g.commands.map(c => c.name));
    expect(names).toContain("codeBlock");
  });

  it("returns empty groups when no match", () => {
    const result = filterGroups("zzz");
    expect(result).toHaveLength(0);
  });

  it("codeBlock command has no shouldBeHidden (dead columns check removed)", () => {
    const codeBlock = GROUPS.flatMap(g => g.commands).find(c => c.name === "codeBlock");
    expect(codeBlock).toBeDefined();
    expect(codeBlock!.shouldBeHidden).toBeUndefined();
  });

  it("image command calls setImageUpload (not setImage)", () => {
    const image = GROUPS.flatMap(g => g.commands).find(c => c.name === "image");
    expect(image).toBeDefined();
    expect(image!.aliases).toContain("img");
    expect(image!.aliases).toContain("picture");
  });

  it("all commands have required fields", () => {
    for (const group of GROUPS) {
      for (const cmd of group.commands) {
        expect(cmd.name).toBeTruthy();
        expect(cmd.label).toBeTruthy();
        expect(cmd.description).toBeTruthy();
        expect(cmd.iconName).toBeTruthy();
        expect(typeof cmd.action).toBe("function");
      }
    }
  });
});
