/**
 * Server-only ownership helpers. Do not import from Client Components.
 *
 * Trusted ownerId values come from authentication in a later phase.
 * Never treat ownerId from an untrusted request body as authorization.
 */
import { Types } from "mongoose";
import { AppError, ErrorCodes } from "@/lib/server/errors";
import { assertServerOnly } from "@/lib/server/runtime";

assertServerOnly("lib/server/ownership");

export type OwnedRecordTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type ArchiveMetadata = {
  archivedAt?: Date | null;
  archivedUntilDeleted?: boolean;
};

export type OwnedRecordFields = OwnedRecordTimestamps &
  ArchiveMetadata & {
    ownerId: Types.ObjectId;
  };

/**
 * Strict ObjectId validation. Mongoose's isValid alone accepts some non-canonical values.
 */
export function isStrictObjectIdString(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  if (!Types.ObjectId.isValid(value)) {
    return false;
  }

  try {
    return new Types.ObjectId(value).toString() === value;
  } catch {
    return false;
  }
}

export function parseObjectId(
  value: unknown,
  fieldName = "id",
): Types.ObjectId {
  if (!isStrictObjectIdString(value)) {
    throw new AppError({
      code: ErrorCodes.VALIDATION_ERROR,
      publicMessage: `Invalid ${fieldName}.`,
      details: { field: fieldName },
    });
  }

  return new Types.ObjectId(value);
}

/**
 * Requires a trusted owner id before any database access.
 */
export function requireOwnerId(ownerId: unknown): Types.ObjectId {
  if (ownerId == null || ownerId === "") {
    throw new AppError({
      code: ErrorCodes.VALIDATION_ERROR,
      publicMessage: "A valid ownerId is required.",
      details: { field: "ownerId" },
    });
  }

  return parseObjectId(ownerId, "ownerId");
}

export type OwnedFilterInput = Record<string, unknown>;

/**
 * Builds an owner-scoped filter.
 * Additional filters cannot replace or omit the trusted ownerId.
 */
export function buildOwnedFilter(
  trustedOwnerId: unknown,
  additional: OwnedFilterInput = {},
): Record<string, unknown> & { ownerId: Types.ObjectId } {
  const ownerId = requireOwnerId(trustedOwnerId);

  const rest: OwnedFilterInput = { ...additional };
  delete rest.ownerId;

  return {
    ...rest,
    ownerId,
  };
}

/**
 * Ensures a candidate update payload cannot change ownership.
 */
export function omitOwnerIdFromUpdate(
  update: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...update };
  delete next.ownerId;

  if (
    next.$set &&
    typeof next.$set === "object" &&
    next.$set !== null &&
    !Array.isArray(next.$set)
  ) {
    const set = { ...(next.$set as Record<string, unknown>) };
    delete set.ownerId;
    next.$set = set;
  }

  if (
    next.$unset &&
    typeof next.$unset === "object" &&
    next.$unset !== null &&
    !Array.isArray(next.$unset)
  ) {
    const unset = { ...(next.$unset as Record<string, unknown>) };
    delete unset.ownerId;
    next.$unset = unset;
  }

  return next;
}
