/**
 * Append-only audit writer.
 * Importing this module does not connect to MongoDB or write events.
 */
import { connectToDatabase } from "@/lib/server/db";
import { AppError, ErrorCodes } from "@/lib/server/errors";
import { logger, redactSensitive } from "@/lib/server/logger";
import { parseObjectId, requireOwnerId } from "@/lib/server/ownership";
import { assertServerOnly } from "@/lib/server/runtime";
import { AuditEvent } from "@/models/audit-event";
import {
  createAuditEventSchema,
  type CreateAuditEventInput,
} from "@/validation/audit-event";

assertServerOnly("services/audit");

const FORBIDDEN_METADATA_KEYS =
  /^(password|passwd|token|authorization|cookie|secret|apikey|api_key|document|body|profile|resume|content)$/i;

function sanitizeMetadata(
  metadata: Record<string, unknown>,
): Record<string, unknown> {
  const redacted = redactSensitive(metadata) as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(redacted)) {
    if (FORBIDDEN_METADATA_KEYS.test(key)) {
      continue;
    }
    sanitized[key] = value;
  }

  return sanitized;
}

export type WriteAuditEventResult = {
  id: string;
  createdAt: Date;
};

/**
 * Writes a single audit event after explicit caller invocation.
 * Failures are not swallowed.
 */
export async function writeAuditEvent(
  input: CreateAuditEventInput,
): Promise<WriteAuditEventResult> {
  const parsed = createAuditEventSchema.safeParse(input);
  if (!parsed.success) {
    throw new AppError({
      code: ErrorCodes.VALIDATION_ERROR,
      publicMessage: "Audit event input is invalid.",
      details: { issues: parsed.error.issues.map((issue) => issue.message) },
    });
  }

  const data = parsed.data;
  const ownerId = requireOwnerId(data.ownerId);
  const actorId = parseObjectId(data.actorId, "actorId");
  const targetId = data.targetId
    ? parseObjectId(data.targetId, "targetId")
    : undefined;
  const metadata = sanitizeMetadata(data.metadata ?? {});

  await connectToDatabase();

  try {
    const created = await AuditEvent.create({
      ownerId,
      actorId,
      eventType: data.eventType,
      targetType: data.targetType,
      ...(targetId ? { targetId } : {}),
      metadata,
      ...(data.requestId ? { requestId: data.requestId } : {}),
      ...(data.correlationId ? { correlationId: data.correlationId } : {}),
      createdAt: new Date(),
    });

    logger.info("audit.event.written", {
      requestId: data.requestId,
      correlationId: data.correlationId,
      eventType: data.eventType,
      targetType: data.targetType,
      auditEventId: String(created._id),
    });

    return {
      id: String(created._id),
      createdAt: created.createdAt,
    };
  } catch (error) {
    logger.error("audit.event.write_failed", {
      requestId: data.requestId,
      correlationId: data.correlationId,
      eventType: data.eventType,
      err: error instanceof Error ? error : String(error),
    });
    throw error;
  }
}
