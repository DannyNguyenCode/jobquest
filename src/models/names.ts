/**
 * Centralized Mongoose model names for hot-reload-safe registration.
 */
export const ModelNames = {
  AuditEvent: "AuditEvent",
} as const;

export type ModelName = (typeof ModelNames)[keyof typeof ModelNames];
