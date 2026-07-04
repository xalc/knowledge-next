import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache revalidateTag
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

// Mock @/lib/dal (verifySession)
const mockVerifySession = vi.fn();
vi.mock("@/lib/dal", () => ({
  verifySession: mockVerifySession,
}));

// Mock @/lib/prisma
const mockPrisma = {
  postContent: {
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  post: {
    update: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
};
vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

import { saveArticleAction } from "@/actions/article";
import { revalidateTag } from "next/cache";

describe("saveArticleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockVerifySession.mockResolvedValue({ isAuth: false });
    const result = await saveArticleAction("{}", JSON.stringify({ title: "t" }));
    expect(result.code).toBe(401);
    expect(result.message).toContain("登录");
  });

  it("returns 401 when user is null", async () => {
    mockVerifySession.mockResolvedValue(null);
    const result = await saveArticleAction("{}", JSON.stringify({ title: "t" }));
    expect(result.code).toBe(401);
  });

  it("updates existing post when contentId provided", async () => {
    mockVerifySession.mockResolvedValue({ isAuth: true, id: "user1" });
    mockPrisma.postContent.update.mockResolvedValue({ id: "c1" });
    mockPrisma.post.update.mockResolvedValue({ id: "p1" });

    const metadata = JSON.stringify({
      title: "Test",
      description: "Desc",
      slug: "test-slug",
      tags: ["a"],
      author: "me",
      contentId: "c1",
      id: "p1",
      cover: "",
    });

    const result = await saveArticleAction(JSON.stringify({ type: "doc" }), metadata);

    expect(mockPrisma.postContent.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { content: { type: "doc" } },
    });
    expect(mockPrisma.post.update).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith("posts");
    expect(result.code).toBe(200);
  });

  it("creates new post when no contentId", async () => {
    mockVerifySession.mockResolvedValue({ isAuth: true, id: "user1" });
    mockPrisma.post.findUnique.mockResolvedValue(null); // slug not taken
    mockPrisma.postContent.create.mockResolvedValue({ id: "new-c1" });
    mockPrisma.post.create.mockResolvedValue({ id: "new-p1" });

    const metadata = JSON.stringify({
      title: "New Post",
      description: "Desc",
      slug: "new-slug",
      tags: [],
      author: "me",
      cover: "",
    });

    const result = await saveArticleAction(JSON.stringify({ type: "doc" }), metadata);

    expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({ where: { slug: "new-slug" } });
    expect(mockPrisma.postContent.create).toHaveBeenCalled();
    expect(mockPrisma.post.create).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith("posts");
    expect(result.code).toBe(200);
    expect(result.message).toContain("发布");
  });

  it("returns 400 when slug already exists", async () => {
    mockVerifySession.mockResolvedValue({ isAuth: true, id: "user1" });
    mockPrisma.post.findUnique.mockResolvedValue({ id: "existing" }); // slug taken

    const metadata = JSON.stringify({
      title: "Dup",
      description: "Desc",
      slug: "taken-slug",
      tags: [],
      author: "me",
      cover: "",
    });

    const result = await saveArticleAction("{}", metadata);

    expect(result.code).toBe(400);
    expect(result.message).toContain("别名");
    expect(mockPrisma.postContent.create).not.toHaveBeenCalled();
  });

  it("returns 500 on update error", async () => {
    mockVerifySession.mockResolvedValue({ isAuth: true, id: "user1" });
    mockPrisma.postContent.update.mockRejectedValue(new Error("DB error"));

    const metadata = JSON.stringify({
      title: "Test",
      description: "Desc",
      slug: "test-slug",
      tags: [],
      author: "me",
      contentId: "c1",
      id: "p1",
      cover: "",
    });

    const result = await saveArticleAction("{}", metadata);
    expect(result.code).toBe(500);
  });
});
