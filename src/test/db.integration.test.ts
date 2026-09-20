/** @vitest-environment node */
import { describe, expect, it } from "vitest";

/**
 * Database integration tests must use MONGODB_TEST_URI only.
 * They never fall back to MONGODB_URI / production / development databases.
 *
 * Phase 2B does not mutate any database. Enable later with:
 *   MONGODB_TEST_URI=... RUN_DB_INTEGRATION_TESTS=1 npm test
 */
const hasTestUri = Boolean(process.env.MONGODB_TEST_URI?.trim());
const integrationEnabled = process.env.RUN_DB_INTEGRATION_TESTS === "1";
const shouldRun = hasTestUri && integrationEnabled;

const skipReason = !hasTestUri
  ? "MONGODB_TEST_URI is not set; refusing to run database integration tests or fall back to another database"
  : !integrationEnabled
    ? "RUN_DB_INTEGRATION_TESTS is not enabled; Phase 2B does not create or delete database records"
    : undefined;

describe.skipIf(!shouldRun)(
  "MongoDB integration foundation (MONGODB_TEST_URI only)",
  () => {
    it("placeholder — no database mutations in Phase 2B", () => {
      expect(process.env.MONGODB_TEST_URI).toBeTruthy();
      expect(process.env.RUN_DB_INTEGRATION_TESTS).toBe("1");
    });
  },
);

describe("MongoDB integration gate", () => {
  it("documents why integration tests are skipped by default", () => {
    if (!shouldRun) {
      expect(skipReason).toBeTypeOf("string");
      expect(skipReason).toMatch(/MONGODB_TEST_URI|RUN_DB_INTEGRATION_TESTS/);
    } else {
      expect(skipReason).toBeUndefined();
    }
  });
});
