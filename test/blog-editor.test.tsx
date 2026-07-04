import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserContext } from "@/context/UserContext";
import BlogEditor from "@/components/blogs/blog-editor";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/blogs/test-slug",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock deleteArticleAction
vi.mock("@/actions/article", () => ({
  deleteArticleAction: vi.fn(),
}));

// Mock use-toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock BlogMetaForm and BlogMetaPopup to avoid complex form rendering
vi.mock("@/components/blogs/blog-meta-form", () => ({
  BlogMetaForm: ({ onSaved }: { onSaved?: () => void }) => (
    <button data-testid="save-btn" onClick={onSaved}>
      save
    </button>
  ),
}));
vi.mock("@/components/blogs/blog-meta-popup", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock ToC
vi.mock("@/components/blogs/toc", () => ({
  ToC: () => null,
}));

// Mock EditorToolbar
vi.mock("@/components/blogs/editor-toolbar", () => ({
  default: () => null,
}));

// Mock editor-menus and image-block-menu
vi.mock("@/components/blogs/editor-menus", () => ({
  EditorBubbleMenu: () => null,
  EditorFloatingMenu: () => null,
}));
vi.mock("@/components/blogs/image-block-menu", () => ({
  ImageBlockMenu: () => null,
}));

const mockPost = {
  id: "p1",
  slug: "test-slug",
  title: "Test Post",
  description: "Test description",
  cover: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  metadata: { tags: ["test"], author: "me", date: "2024-01-01" },
  postcontent: { content: { type: "doc", content: [{ type: "paragraph" }] } },
};

function renderEditor(overrides: Partial<typeof mockPost> = {}) {
  const userValue = { isAuth: true, name: "test" } as unknown as null;
  return render(
    <UserContext.Provider value={userValue}>
      <BlogEditor post={{ ...mockPost, ...overrides }} />
    </UserContext.Provider>,
  );
}

describe("BlogEditor draft autosave", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the editor with post title", () => {
    renderEditor();
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("shows edit button for authenticated user", () => {
    renderEditor();
    expect(screen.getByText("编辑")).toBeInTheDocument();
  });

  it("enters edit mode on click", async () => {
    renderEditor();
    const editBtn = screen.getByText("编辑");
    await userEvent.click(editBtn);
    expect(screen.getByText("退出编辑")).toBeInTheDocument();
  });

  it("does not show draft restore dialog when no draft exists", async () => {
    renderEditor();
    await userEvent.click(screen.getByText("编辑"));
    expect(screen.queryByText("检测到未保存的草稿")).not.toBeInTheDocument();
  });

  it("shows draft restore dialog when draft exists", async () => {
    // Pre-set a draft in localStorage
    const draftKey = "draft:test-slug";
    localStorage.setItem(
      draftKey,
      JSON.stringify({ content: { type: "doc", content: [] }, timestamp: Date.now() }),
    );

    renderEditor();
    await userEvent.click(screen.getByText("编辑"));
    expect(screen.getByText("检测到未保存的草稿")).toBeInTheDocument();
  });

  it("discards draft on discard button click", async () => {
    const draftKey = "draft:test-slug";
    localStorage.setItem(
      draftKey,
      JSON.stringify({ content: { type: "doc" }, timestamp: Date.now() }),
    );

    renderEditor();
    await userEvent.click(screen.getByText("编辑"));
    const discardBtn = screen.getByText("丢弃草稿");
    await userEvent.click(discardBtn);
    expect(localStorage.getItem(draftKey)).toBeNull();
  });

  it("clears draft on successful save via onSaved callback", async () => {
    const draftKey = "draft:test-slug";
    localStorage.setItem(
      draftKey,
      JSON.stringify({ content: { type: "doc" }, timestamp: Date.now() }),
    );

    renderEditor();
    // Enter edit mode
    await userEvent.click(screen.getByText("编辑"));
    // Click the mocked save button
    const saveBtn = screen.getByTestId("save-btn");
    await userEvent.click(saveBtn);
    // Draft should be cleared
    expect(localStorage.getItem(draftKey)).toBeNull();
  });
});
