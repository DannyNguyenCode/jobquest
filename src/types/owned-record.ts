import type { Types } from "mongoose";
import type {
  ArchiveMetadata,
  OwnedRecordTimestamps,
} from "@/lib/server/ownership";

export type {
  ArchiveMetadata,
  OwnedRecordFields,
  OwnedRecordTimestamps,
} from "@/lib/server/ownership";

export type OwnedRecordBase = OwnedRecordTimestamps &
  ArchiveMetadata & {
    ownerId: Types.ObjectId;
  };
