import type { VerifiedChange } from "@/db/sync";

export interface ChangeRow extends VerifiedChange {
  children?: ChangeRow[];
}

// Collapses repeat edits to the same entity under one row: the most recent
// change stays at the top level, earlier edits become expandable children.
export function groupChanges(changes: VerifiedChange[]): ChangeRow[] {
  const grouped: ChangeRow[] = [];
  const byKey = new Map<string, ChangeRow>();

  for (const change of changes) {
    const key = `${change.entity}:${change.entityId}`;
    const parent = byKey.get(key);
    if (!parent) {
      const row: ChangeRow = { ...change };
      byKey.set(key, row);
      grouped.push(row);
    } else {
      (parent.children ??= []).push({ ...change });
    }
  }

  return grouped;
}
