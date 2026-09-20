/** @vitest-environment node */
import { afterEach, describe, expect, it, vi } from "vitest";
import { logger, redactSensitive } from "@/lib/server/logger";

describe("structured logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redacts nested sensitive keys case-insensitively", () => {
    const redacted = redactSensitive({
      Password: "hunter2",
      nested: {
        api_key: "abc",
        Authorization: "Bearer xyz",
        cookie: "session=1",
        safe: "ok",
      },
      list: [{ token: "t", label: "visible" }],
    }) as Record<string, unknown>;

    expect(redacted.Password).toBe("[REDACTED]");
    const nested = redacted.nested as Record<string, unknown>;
    expect(nested.api_key).toBe("[REDACTED]");
    expect(nested.Authorization).toBe("[REDACTED]");
    expect(nested.cookie).toBe("[REDACTED]");
    expect(nested.safe).toBe("ok");
    const list = redacted.list as Array<Record<string, unknown>>;
    expect(list[0]?.token).toBe("[REDACTED]");
    expect(list[0]?.label).toBe("visible");
  });

  it("redacts credential-bearing URIs even under generic keys", () => {
    const redacted = redactSensitive({
      uri: "mongodb://user:pass@localhost:27017/jobquest_dev",
      mongodbUri: "mongodb+srv://user:pass@cluster/jobquest",
      href: "https://example.com/docs",
    }) as Record<string, unknown>;

    expect(redacted.uri).toBe("[REDACTED]");
    expect(redacted.mongodbUri).toBe("[REDACTED]");
    expect(redacted.href).toBe("https://example.com/docs");
  });

  it("serializes Error objects safely in log output", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

    logger.info("test.event", {
      requestId: "req-1",
      err: new Error("failure with mongodb://user:secret@host/db"),
      password: "nope",
    });

    expect(info).toHaveBeenCalledTimes(1);
    const line = String(info.mock.calls[0]?.[0]);
    expect(line).toContain('"event":"test.event"');
    expect(line).toContain('"requestId":"req-1"');
    expect(line).toContain("[REDACTED]");
    expect(line).not.toContain("secret");
    expect(line).not.toContain("nope");
    expect(line).not.toContain("mongodb://");
  });

  it("does not throw when metadata cannot be serialized", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;

    expect(() => logger.info("test.cyclic", { payload: cyclic })).not.toThrow();
    expect(info).toHaveBeenCalled();
  });
});
