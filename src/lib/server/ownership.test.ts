/** @vitest-environment node */
import { Types } from "mongoose";
import { describe, expect, it, vi } from "vitest";
import {
  buildOwnedFilter,
  isStrictObjectIdString,
  omitOwnerIdFromUpdate,
  parseObjectId,
  requireOwnerId,
} from "@/lib/server/ownership";
import { ErrorCodes, isAppError } from "@/lib/server/errors";

describe("ownership helpers", () => {
  const ownerId = new Types.ObjectId().toString();
  const otherOwnerId = new Types.ObjectId().toString();
  const recordId = new Types.ObjectId().toString();

  it("always includes the trusted ownerId in filters", () => {
    const filter = buildOwnedFilter(ownerId, { status: "active" });

    expect(filter.ownerId.toString()).toBe(ownerId);
    expect(filter.status).toBe("active");
  });

  it("does not allow additional filters to override ownerId", () => {
    const filter = buildOwnedFilter(ownerId, {
      ownerId: otherOwnerId,
      status: "archived",
    });

    expect(filter.ownerId.toString()).toBe(ownerId);
    expect(filter.ownerId.toString()).not.toBe(otherOwnerId);
    expect(filter.status).toBe("archived");
  });

  it("rejects invalid object ids before any query can run", () => {
    expect(isStrictObjectIdString("not-an-id")).toBe(false);
    expect(isStrictObjectIdString("12")).toBe(false);

    try {
      parseObjectId("not-an-id", "recordId");
      expect.fail("expected validation error");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      }
    }
  });

  it("rejects missing owner ids before database access", () => {
    try {
      requireOwnerId(undefined);
      expect.fail("expected validation error");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
        expect(error.publicMessage).toMatch(/ownerId/i);
      }
    }
  });

  it("does not execute a query when identifiers are invalid", async () => {
    const find = vi.fn();

    try {
      const filter = buildOwnedFilter("bad-owner", { _id: recordId });
      find(filter);
      expect.fail("expected validation error before query");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      expect(find).not.toHaveBeenCalled();
    }
  });

  it("strips ownerId from update payloads", () => {
    const update = omitOwnerIdFromUpdate({
      ownerId: otherOwnerId,
      title: "Updated",
      $set: { ownerId: otherOwnerId, note: "safe" },
      $unset: { ownerId: "", obsolete: "" },
    });

    expect(update).not.toHaveProperty("ownerId");
    expect(update.$set).toEqual({ note: "safe" });
    expect(update.$unset).toEqual({ obsolete: "" });
  });
});
