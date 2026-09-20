import type { Types } from "mongoose";

export type AuditEventDocumentFields = {
  ownerId: Types.ObjectId;
  actorId: Types.ObjectId;
  eventType: string;
  targetType: string;
  targetId?: Types.ObjectId;
  metadata: Record<string, unknown>;
  requestId?: string;
  correlationId?: string;
  createdAt: Date;
};
