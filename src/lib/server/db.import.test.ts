/** @vitest-environment node */
import mongoose from "mongoose";
import { describe, expect, it } from "vitest";
import { getConnectionState } from "@/lib/server/db";

describe("mongodb connection module", () => {
  it("does not connect when the database module is imported", async () => {
    expect(getConnectionState()).toBe("disconnected");
    expect(mongoose.connection.readyState).toBe(0);
  });

  it("does not connect when the audit model is imported", async () => {
    await import("@/models/audit-event");
    expect(mongoose.connection.readyState).toBe(0);
  });

  it("does not connect when the audit service module is imported", async () => {
    await import("@/services/audit");
    expect(mongoose.connection.readyState).toBe(0);
  });
});
