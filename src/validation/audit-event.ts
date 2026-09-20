import { z } from "zod";

const objectIdString = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Must be a 24-character hex ObjectId");

/**
 * Validation schema for appending an audit event.
 * ownerId and actorId must be supplied by trusted server code.
 */
export const createAuditEventSchema = z.object({
  ownerId: objectIdString,
  actorId: objectIdString,
  eventType: z.string().trim().min(1).max(120),
  targetType: z.string().trim().min(1).max(120),
  targetId: objectIdString.optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  requestId: z.string().trim().min(1).max(120).optional(),
  correlationId: z.string().trim().min(1).max(120).optional(),
});

export type CreateAuditEventInput = z.input<typeof createAuditEventSchema>;
export type CreateAuditEventParsed = z.output<typeof createAuditEventSchema>;
