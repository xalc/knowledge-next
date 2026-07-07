import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  syncWRDataToDB: vi.fn(),
}));

vi.mock("@/lib/dal", () => ({
  verifySession: mocks.verifySession,
}));

vi.mock("@/lib/wereader/wr-writer", () => ({
  syncWRDataToDB: mocks.syncWRDataToDB,
}));

describe("dashboard WeRead sync feature flag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.WEREAD_DASHBOARD_SYNC_ENABLED;
    mocks.verifySession.mockResolvedValue({ isAuth: true });
    mocks.syncWRDataToDB.mockResolvedValue({
      ok: true,
      steps: [],
      message: "sync completed",
    });
  });

  it("skips syncWRDataToDB by default", async () => {
    const { GET } = await import("@/app/api/dashboard/route");

    const response = await GET();
    const text = await response.text();

    expect(text).toContain("[SYNC][SKIPPED]");
    expect(text).toContain('"skipped": true');
    expect(text).toContain('"featureFlag": "WEREAD_DASHBOARD_SYNC_ENABLED"');
    expect(mocks.syncWRDataToDB).not.toHaveBeenCalled();
  });

  it("calls syncWRDataToDB when explicitly enabled", async () => {
    process.env.WEREAD_DASHBOARD_SYNC_ENABLED = "true";
    const { GET } = await import("@/app/api/dashboard/route");

    const response = await GET();
    const text = await response.text();

    expect(mocks.syncWRDataToDB).toHaveBeenCalledTimes(1);
    expect(text).toContain('"message": "sync completed"');
    expect(text).not.toContain("[SYNC][SKIPPED]");
  });
});
