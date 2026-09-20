/**
 * Server-only application errors. Do not import from Client Components.
 */
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("lib/server/errors");

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  DATABASE_UNAVAILABLE: "DATABASE_UNAVAILABLE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

const statusByCode: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  CONFIGURATION_ERROR: 500,
  DATABASE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

const defaultPublicMessage: Record<ErrorCode, string> = {
  VALIDATION_ERROR: "The request could not be validated.",
  UNAUTHENTICATED: "Authentication is required.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "The request conflicts with the current state.",
  CONFIGURATION_ERROR: "The server configuration is incomplete or invalid.",
  DATABASE_UNAVAILABLE: "The database is temporarily unavailable.",
  INTERNAL_ERROR: "An unexpected error occurred.",
};

export type AppErrorOptions = {
  code: ErrorCode;
  publicMessage?: string;
  status?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly publicMessage: string;
  readonly details?: Record<string, unknown>;
  override readonly cause?: unknown;

  constructor(options: AppErrorOptions) {
    const publicMessage =
      options.publicMessage ?? defaultPublicMessage[options.code];
    super(publicMessage);
    this.name = "AppError";
    this.code = options.code;
    this.status = options.status ?? statusByCode[options.code];
    this.publicMessage = publicMessage;
    this.details = options.details;
    this.cause = options.cause;
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    const name = error.name.toLowerCase();
    const message = error.message.toLowerCase();

    if (
      name.includes("mongo") ||
      message.includes("buffering timed out") ||
      message.includes("econnrefused") ||
      message.includes("mongodb")
    ) {
      return new AppError({
        code: ErrorCodes.DATABASE_UNAVAILABLE,
        cause: error,
      });
    }

    return new AppError({
      code: ErrorCodes.INTERNAL_ERROR,
      cause: error,
    });
  }

  return new AppError({
    code: ErrorCodes.INTERNAL_ERROR,
    cause: error,
  });
}

export type SerializedAppError = {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type SerializeAppErrorOptions = {
  /**
   * When true, includes non-sensitive validation details suitable for clients.
   * Never includes stack traces, URIs, or raw third-party payloads.
   */
  includeDetails?: boolean;
  /**
   * Development-only diagnostics. Must remain false in production responses.
   */
  includeDebug?: boolean;
};

export function serializeAppError(
  error: unknown,
  options: SerializeAppErrorOptions = {},
): SerializedAppError {
  const appError = toAppError(error);
  const body: SerializedAppError = {
    error: {
      code: appError.code,
      message: appError.publicMessage,
    },
  };

  if (
    options.includeDetails &&
    appError.code === ErrorCodes.VALIDATION_ERROR &&
    appError.details
  ) {
    body.error.details = appError.details;
  }

  if (options.includeDebug && process.env.NODE_ENV !== "production") {
    // Intentionally omit secrets, stacks, and raw causes from the public body.
    // Debug mode only confirms that a cause existed.
    body.error.details = {
      ...(body.error.details ?? {}),
      hasCause: appError.cause != null,
    };
  }

  return body;
}

export function getHttpStatus(error: unknown): number {
  return toAppError(error).status;
}
