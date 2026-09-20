/** @vitest-environment node */
import { describe, expect, it } from "vitest";
import {
  expectedMongoDatabaseName,
  extractMongoDatabaseName,
  resolveMongoUri,
} from "@/lib/server/env";
import { ErrorCodes, isAppError } from "@/lib/server/errors";

describe("server env", () => {
  it("maps runtimes to the approved database names", () => {
    expect(expectedMongoDatabaseName("development")).toBe("jobquest_dev");
    expect(expectedMongoDatabaseName("test")).toBe("jobquest_test");
    expect(expectedMongoDatabaseName("production")).toBe("jobquest");
  });

  it("selects MONGODB_TEST_URI in the test runtime and never falls back", () => {
    const uri = resolveMongoUri({
      runtime: "test",
      mongodbTestUri: "mongodb://127.0.0.1:27017/jobquest_test",
      mongodbUri: "mongodb://127.0.0.1:27017/jobquest_dev",
    });

    expect(uri).toBe("mongodb://127.0.0.1:27017/jobquest_test");
  });

  it("fails safely when MONGODB_TEST_URI is required but absent", () => {
    try {
      resolveMongoUri({
        runtime: "test",
        mongodbUri: "mongodb://127.0.0.1:27017/jobquest_dev",
      });
      expect.fail("expected configuration error");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
        expect(error.publicMessage).toMatch(/MONGODB_TEST_URI/);
        expect(error.publicMessage).not.toMatch(/mongodb:\/\//i);
      }
    }
  });

  it("rejects a URI whose database name does not match the runtime", () => {
    try {
      resolveMongoUri({
        runtime: "development",
        mongodbUri: "mongodb://127.0.0.1:27017/jobquest",
      });
      expect.fail("expected configuration error");
    } catch (error) {
      expect(isAppError(error)).toBe(true);
      if (isAppError(error)) {
        expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
        expect(error.publicMessage).toMatch(/jobquest_dev/);
      }
    }
  });

  it("extracts database names from MongoDB URIs", () => {
    expect(
      extractMongoDatabaseName("mongodb://127.0.0.1:27017/jobquest_dev"),
    ).toBe("jobquest_dev");
    expect(extractMongoDatabaseName("mongodb://127.0.0.1:27017/")).toBeNull();
  });
});
