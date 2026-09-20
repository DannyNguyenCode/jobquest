/**
 * AuditEvent Mongoose model.
 * Importing this module does not connect to MongoDB.
 */
import { Schema, type InferSchemaType, models, model } from "mongoose";
import { ModelNames } from "@/models/names";
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("models/audit-event");

const AuditEventSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    requestId: {
      type: String,
      required: false,
      trim: true,
      maxlength: 120,
    },
    correlationId: {
      type: String,
      required: false,
      trim: true,
      maxlength: 120,
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
  },
  {
    collection: "audit_events",
    versionKey: false,
  },
);

AuditEventSchema.index({ ownerId: 1, createdAt: -1 });
AuditEventSchema.index({ ownerId: 1, eventType: 1, createdAt: -1 });

export type AuditEventSchemaType = InferSchemaType<typeof AuditEventSchema>;

export const AuditEvent =
  models[ModelNames.AuditEvent] ??
  model(ModelNames.AuditEvent, AuditEventSchema);
