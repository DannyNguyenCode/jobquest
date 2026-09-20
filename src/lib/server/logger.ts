/**
 * Server-only structured logger. Do not import from Client Components.
 */
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("lib/server/logger");

export type LogLevel = "info" | "warn" | "error";

export type LogContext = {
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
};

const REDACTED = "[REDACTED]";

const SENSITIVE_KEY_PATTERN =
  /^(password|passwd|token|authorization|cookie|secret|apikey|api_key|apisecret|api_secret|mongodburi|mongodb_uri|auth_secret|resend_api_key|cloudinary_api_key|cloudinary_api_secret|pdf_extractor_api_key)$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function looksLikeCredentialUri(value: string): boolean {
  return (
    /mongodb(\+srv)?:\/\//i.test(value) || /:\/\/[^/\s]+:[^/\s]+@/.test(value)
  );
}

function serializeError(error: Error): Record<string, unknown> {
  return {
    name: error.name,
    message: looksLikeCredentialUri(error.message) ? REDACTED : error.message,
  };
}

export function redactSensitive(value: unknown, keyHint = ""): unknown {
  if (value == null) {
    return value;
  }

  if (typeof value === "string") {
    if (SENSITIVE_KEY_PATTERN.test(keyHint) || looksLikeCredentialUri(value)) {
      return REDACTED;
    }
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    if (SENSITIVE_KEY_PATTERN.test(keyHint)) {
      return REDACTED;
    }
    return value;
  }

  if (value instanceof Error) {
    return serializeError(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitive(item, keyHint));
  }

  if (isPlainObject(value)) {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        output[key] = REDACTED;
        continue;
      }
      output[key] = redactSensitive(nested, key);
    }
    return output;
  }

  try {
    return String(value);
  } catch {
    return "[Unserializable]";
  }
}

function safeSerializeMetadata(
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!metadata) {
    return {};
  }

  try {
    const redacted = redactSensitive(metadata);
    return JSON.parse(JSON.stringify(redacted)) as Record<string, unknown>;
  } catch {
    return { serialization: "failed" };
  }
}

type LogPayload = {
  level: LogLevel;
  event: string;
  requestId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
};

function write(level: LogLevel, event: string, context: LogContext = {}): void {
  const { requestId, correlationId, ...rest } = context;
  const payload: LogPayload = {
    level,
    event,
    timestamp: new Date().toISOString(),
  };

  if (requestId) {
    payload.requestId = String(requestId);
  }
  if (correlationId) {
    payload.correlationId = String(correlationId);
  }

  const metadata = safeSerializeMetadata(rest);
  if (Object.keys(metadata).length > 0) {
    payload.metadata = metadata;
  }

  let line: string;
  try {
    line = JSON.stringify(payload);
  } catch {
    line = JSON.stringify({
      level,
      event,
      timestamp: payload.timestamp,
      metadata: { serialization: "failed" },
    });
  }

  switch (level) {
    case "info":
      console.info(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
}

export const logger = {
  info(event: string, context?: LogContext): void {
    write("info", event, context);
  },
  warn(event: string, context?: LogContext): void {
    write("warn", event, context);
  },
  error(event: string, context?: LogContext): void {
    write("error", event, context);
  },
};
