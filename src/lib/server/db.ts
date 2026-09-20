/**
 * Server-only Mongoose connection management for Next.js.
 * Do not import from Client Components.
 *
 * Connection is lazy: importing this module does not open a database connection.
 */
import mongoose from "mongoose";
import { getMongoRuntime, getMongoUri } from "@/lib/server/env";
import { AppError, ErrorCodes } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("lib/server/db");

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __jobquestMongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.__jobquestMongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.__jobquestMongooseCache = cache;

export type ConnectionStateName =
  | "disconnected"
  | "connected"
  | "connecting"
  | "disconnecting"
  | "uninitialized";

const STATE_NAMES: Record<number, ConnectionStateName> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

export function getConnectionState(): ConnectionStateName {
  return STATE_NAMES[mongoose.connection.readyState] ?? "uninitialized";
}

export function isDatabaseConnected(): boolean {
  return getConnectionState() === "connected";
}

/**
 * Connects to MongoDB using the runtime-selected URI.
 * Caches the connection promise across hot reloads.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn && getConnectionState() === "connected") {
    return cache.conn;
  }

  if (!cache.promise) {
    let uri: string;
    try {
      uri = getMongoUri();
    } catch (error) {
      cache.promise = null;
      throw error;
    }

    const runtime = getMongoRuntime();
    logger.info("mongodb.connect.start", { runtime });

    cache.promise = mongoose
      .connect(uri)
      .then((connected) => {
        logger.info("mongodb.connect.success", {
          runtime,
          state: STATE_NAMES[connected.connection.readyState],
        });
        return connected;
      })
      .catch((error: unknown) => {
        cache.promise = null;
        logger.error("mongodb.connect.failure", {
          runtime,
          err: error instanceof Error ? error : String(error),
        });
        throw new AppError({
          code: ErrorCodes.DATABASE_UNAVAILABLE,
          cause: error,
        });
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/**
 * Test-only disconnect and cache reset.
 * Refuses to run outside the test runtime.
 */
export async function disconnectDatabaseForTests(): Promise<void> {
  if (getMongoRuntime() !== "test") {
    throw new AppError({
      code: ErrorCodes.FORBIDDEN,
      publicMessage:
        "Database disconnect reset is only available in the test runtime.",
    });
  }

  if (cache.promise) {
    try {
      await cache.promise;
    } catch {
      // Ignore failed connect attempts while resetting.
    }
  }

  await mongoose.disconnect();
  cache.conn = null;
  cache.promise = null;
  globalThis.__jobquestMongooseCache = cache;
  logger.info("mongodb.disconnect.test_reset");
}

export function getMongoose(): typeof mongoose {
  return mongoose;
}
