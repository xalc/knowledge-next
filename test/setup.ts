import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";

// Stub server-only (imported by dal.ts) — breaks in non-Next runtime
vi.mock("server-only", () => ({}));

// Stub next/headers (used by dal.ts for cookies)
vi.mock("next/headers", () => ({
  cookies: () => Promise.resolve({ get: () => undefined, set: () => {} }),
  headers: () => Promise.resolve({ get: () => undefined }),
}));

// Stub next/navigation (used by client components)
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Stub @vercel/blob/client (network call in ImageUpload hooks + blog-meta-form)
vi.mock("@vercel/blob/client", () => ({
  upload: vi.fn().mockResolvedValue({ url: "https://example.com/test.png" }),
}));

// jsdom lacks URL.createObjectURL / revokeObjectURL
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = vi.fn();
}

// jsdom getBoundingClientRect returns zeros — needed for BubbleMenu/tippy positioning
if (!Element.prototype.getBoundingClientRect) {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 100,
    height: 30,
    top: 0,
    left: 0,
    bottom: 30,
    right: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }));
}

afterEach(() => {
  vi.clearAllMocks();
});
