/** @vitest-environment node */
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const connectToDatabase = vi.fn();
const create = vi.fn();

vi.mock("@/lib/server/db", () => ({
  connectToDatabase,
}));

vi.mock("@/models/audit-event", () => ({
  AuditEvent: {
    create,
  },
}));

describe("writeAuditEvent", () => {
  beforeEach(() => {
    connectToDatabase.mockReset();
    create.mockReset();
    vi.resetModules();
  });

  it("validates input, sanitizes metadata, and writes only when invoked", async () => {
    const ownerId = new Types.ObjectId().toString();
    const actorId = new Types.ObjectId().toString();
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    connectToDatabase.mockResolvedValue({});
    create.mockResolvedValue({
      _id: new Types.ObjectId(),
      createdAt,
    });

    const { writeAuditEvent } = await import("@/services/audit");

    expect(connectToDatabase).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();

    const result = await writeAuditEvent({
      ownerId,
      actorId,
      eventType: "profile.updated",
      targetType: "CandidateProfile",
      metadata: {
        password: "secret",
        field: "preferences",
      },
      requestId: "req-123",
    });

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    const payload = create.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload.metadata).toEqual({ field: "preferences" });
    expect(payload.metadata).not.toHaveProperty("password");
    expect(result.createdAt).toEqual(createdAt);
  });

  it("rejects invalid owner or actor ids without writing", async () => {
    const { writeAuditEvent } = await import("@/services/audit");
    const { ErrorCodes, isAppError } = await import("@/lib/server/errors");

    try {
      await writeAuditEvent({
        ownerId: "bad",
        actorId: new Types.ObjectId().toString(),
        eventType: "test",
        targetType: "Test",
      });
      expect.fail("expected validation error");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      }
    }

    expect(connectToDatabase).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("does not hide write failures", async () => {
    const ownerId = new Types.ObjectId().toString();
    const actorId = new Types.ObjectId().toString();
    connectToDatabase.mockResolvedValue({});
    create.mockRejectedValue(new Error("write failed"));

    const { writeAuditEvent } = await import("@/services/audit");

    await expect(
      writeAuditEvent({
        ownerId,
        actorId,
        eventType: "test.event",
        targetType: "Test",
      }),
    ).rejects.toThrow(/write failed/);
  });
});
