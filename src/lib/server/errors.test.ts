/** @vitest-environment node */
import { describe, expect, it } from "vitest";
import {
  AppError,
  ErrorCodes,
  getHttpStatus,
  serializeAppError,
  toAppError,
} from "@/lib/server/errors";

describe("AppError system", () => {
  it("preserves known AppError values", () => {
    const error = new AppError({
      code: ErrorCodes.NOT_FOUND,
      publicMessage: "Opportunity not found.",
      cause: new Error("internal find miss"),
    });

    const converted = toAppError(error);
    expect(converted).toBe(error);
    expect(converted.status).toBe(404);
    expect(converted.cause).toBeInstanceOf(Error);
  });

  it("converts unknown errors into INTERNAL_ERROR safely", () => {
    const converted = toAppError(new Error("boom"));
    expect(converted.code).toBe(ErrorCodes.INTERNAL_ERROR);
    expect(converted.publicMessage).not.toMatch(/boom/);
    expect(getHttpStatus(converted)).toBe(500);
  });

  it("maps mongo-like failures to DATABASE_UNAVAILABLE", () => {
    const converted = toAppError(new Error("MongoServerError: ECONNREFUSED"));
    expect(converted.code).toBe(ErrorCodes.DATABASE_UNAVAILABLE);
    expect(converted.status).toBe(503);
  });

  it("serializes a safe public payload without stacks or secrets", () => {
    const error = new AppError({
      code: ErrorCodes.CONFIGURATION_ERROR,
      publicMessage:
        "MONGODB_URI is required for development and production database access.",
      cause: new Error(
        "Failed with mongodb://user:secret@localhost:27017/jobquest_dev",
      ),
      details: { hint: "set local env" },
    });

    const payload = serializeAppError(error);
    const json = JSON.stringify(payload);

    expect(payload.error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
    expect(payload.error.message).toMatch(/MONGODB_URI/);
    expect(payload.error).not.toHaveProperty("stack");
    expect(json).not.toMatch(/secret/i);
    expect(json).not.toMatch(/mongodb:\/\//i);
    expect(payload.error.details).toBeUndefined();
  });

  it("can include validation details without exposing causes", () => {
    const error = new AppError({
      code: ErrorCodes.VALIDATION_ERROR,
      publicMessage: "Invalid ownerId.",
      details: { field: "ownerId" },
      cause: new Error("raw"),
    });

    const payload = serializeAppError(error, { includeDetails: true });
    expect(payload.error.details).toEqual({ field: "ownerId" });
  });
});
