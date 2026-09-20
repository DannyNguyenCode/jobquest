/**
 * Server-only environment access. Do not import from Client Components.
 *
 * Secrets are validated lazily when a server service needs them.
 * Build/static generation must not fail merely because local secrets are absent.
 */
import { z } from "zod";
import { AppError, ErrorCodes } from "@/lib/server/errors";
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("lib/server/env");

/** Approved environment variable names (values never belong in source control). */
export const APPROVED_ENV_NAMES = [
  "MONGODB_URI",
  "MONGODB_TEST_URI",
  "AUTH_SECRET",
  "RESEND_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "PDF_EXTRACTOR_URL",
  "PDF_EXTRACTOR_API_KEY",
] as const;

export type ApprovedEnvName = (typeof APPROVED_ENV_NAMES)[number];

/** Future service variables — recognized names only; not validated in Phase 2B. */
export const FUTURE_SERVICE_ENV_NAMES = [
  "AUTH_SECRET",
  "RESEND_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "PDF_EXTRACTOR_URL",
  "PDF_EXTRACTOR_API_KEY",
] as const;

export type MongoRuntime = "development" | "test" | "production";

const nonEmptyString = z.string().trim().min(1);

function configurationError(publicMessage: string): AppError {
  return new AppError({
    code: ErrorCodes.CONFIGURATION_ERROR,
    publicMessage,
  });
}

/**
 * Determines which MongoDB environment the process should use.
 * Test runtime never falls back to MONGODB_URI.
 */
export function getMongoRuntime(): MongoRuntime {
  if (process.env.VITEST === "true" || process.env.NODE_ENV === "test") {
    return "test";
  }

  if (process.env.NODE_ENV === "production") {
    return "production";
  }

  return "development";
}

export function expectedMongoDatabaseName(runtime: MongoRuntime): string {
  switch (runtime) {
    case "test":
      return "jobquest_test";
    case "production":
      return "jobquest";
    default:
      return "jobquest_dev";
  }
}

/**
 * Extracts the database name from a MongoDB connection string when present.
 * Returns null when the URI has no path database segment.
 */
export function extractMongoDatabaseName(uri: string): string | null {
  try {
    const normalized = uri.replace(/^mongodb(\+srv)?:\/\//, "http://");
    const url = new URL(normalized);
    const name = url.pathname.replace(/^\//, "").split("?")[0];
    return name ? decodeURIComponent(name) : null;
  } catch {
    return null;
  }
}

function assertExpectedDatabase(uri: string, runtime: MongoRuntime): void {
  const expected = expectedMongoDatabaseName(runtime);
  const actual = extractMongoDatabaseName(uri);

  if (actual && actual !== expected) {
    throw configurationError(
      `MongoDB URI database name must be "${expected}" for the ${runtime} environment.`,
    );
  }
}

export type ResolveMongoUriInput = {
  runtime: MongoRuntime;
  mongodbUri?: string;
  mongodbTestUri?: string;
};

/**
 * Pure URI selection used by getMongoUri.
 * Test runtime requires MONGODB_TEST_URI and never substitutes MONGODB_URI.
 */
export function resolveMongoUri(input: ResolveMongoUriInput): string {
  const { runtime, mongodbUri, mongodbTestUri } = input;

  if (runtime === "test") {
    if (mongodbTestUri == null || mongodbTestUri.trim() === "") {
      throw configurationError(
        "MONGODB_TEST_URI is required for automated tests and must not fall back to MONGODB_URI.",
      );
    }

    const parsed = nonEmptyString.safeParse(mongodbTestUri);
    if (!parsed.success) {
      throw configurationError("MONGODB_TEST_URI is invalid.");
    }

    assertExpectedDatabase(parsed.data, "test");
    return parsed.data;
  }

  if (mongodbUri == null || mongodbUri.trim() === "") {
    throw configurationError(
      "MONGODB_URI is required for development and production database access.",
    );
  }

  const parsed = nonEmptyString.safeParse(mongodbUri);
  if (!parsed.success) {
    throw configurationError("MONGODB_URI is invalid.");
  }

  assertExpectedDatabase(parsed.data, runtime);
  return parsed.data;
}

/**
 * Returns the MongoDB URI for the current runtime.
 * Validates only when invoked — not at module import or build time.
 */
export function getMongoUri(): string {
  return resolveMongoUri({
    runtime: getMongoRuntime(),
    mongodbUri: process.env.MONGODB_URI,
    mongodbTestUri: process.env.MONGODB_TEST_URI,
  });
}

export function isFutureServiceEnvName(name: string): boolean {
  return (FUTURE_SERVICE_ENV_NAMES as readonly string[]).includes(name);
}
