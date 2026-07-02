// Shared shapes for content-change tracking, sync state, and PR attribution.
export type ContentEntityType = "song" | "album";

export interface PendingEntity {
  entity: ContentEntityType;
  entityId: string;
  changeIds: string[];
}

export interface ChangeUser {
  id: string;
  name: string;
  image: string | null;
}

export interface LastChange {
  user: ChangeUser;
  createdAt: Date;
  synced: boolean;
}

export interface EntityInfo {
  title: string | null;
  coverArt: string | null;
}

export interface RecentChange {
  id: string;
  entity: ContentEntityType;
  entityId: string;
  createdAt: Date;
  synced: boolean;
  syncedAt: Date | null;
  commitSha: string | null;
  user: ChangeUser;
  entityInfo: EntityInfo;
}

export interface PendingPreview {
  entity: ContentEntityType;
  entityId: string;
  count: number;
  lastAt: Date;
  user: ChangeUser;
  entityInfo: EntityInfo;
}

export interface ChangeEditor {
  name: string;
  username: string | null;
}

export interface ChangeAttribution {
  entity: ContentEntityType;
  entityId: string;
  count: number;
  editors: ChangeEditor[];
}
