"use client";

import { useRef, useSyncExternalStore } from "react";

import type { VisibilityState } from "@tanstack/react-table";

interface TablePreferences {
  columnVisibility: VisibilityState;
  columnOrder: string[];
}

function getKey(tableId: string) {
  return `table-prefs:${tableId}`;
}

function readPrefs(tableId: string): Partial<TablePreferences> {
  try {
    const raw = localStorage.getItem(getKey(tableId));
    return raw ? (JSON.parse(raw) as Partial<TablePreferences>) : {};
  } catch {
    return {};
  }
}

function writePrefs(tableId: string, prefs: Partial<TablePreferences>) {
  try {
    localStorage.setItem(getKey(tableId), JSON.stringify(prefs));
    // ponytail: synthetic event so same-tab useSyncExternalStore re-reads.
    window.dispatchEvent(new StorageEvent("storage", { key: getKey(tableId) }));
  } catch {}
}

const EMPTY_PREFS: Partial<TablePreferences> = {};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

export function useTablePreferences(
  tableId: string,
  defaultVisibility: VisibilityState = {},
  defaultOrder: string[] = [],
) {
  // Cache raw JSON string -> parsed object so `getSnapshot` returns a stable reference
  const cacheRef = useRef<{ raw: string | null; prefs: Partial<TablePreferences> }>({
    raw: null,
    prefs: {},
  });

  function getSnapshot(): Partial<TablePreferences> {
    try {
      const raw = localStorage.getItem(getKey(tableId));
      if (raw === cacheRef.current.raw) return cacheRef.current.prefs;
      const prefs: Partial<TablePreferences> = raw
        ? (JSON.parse(raw) as Partial<TablePreferences>)
        : {};
      cacheRef.current = { raw, prefs };
      return prefs;
    } catch {
      return cacheRef.current.prefs;
    }
  }

  const snap = useSyncExternalStore<Partial<TablePreferences>>(
    subscribe,
    getSnapshot,
    () => EMPTY_PREFS,
  );
  const columnVisibility: VisibilityState =
    snap.columnVisibility ?? defaultVisibility;
  const columnOrder: string[] = snap.columnOrder?.length
    ? snap.columnOrder
    : defaultOrder;

  function setColumnVisibility(
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState),
  ) {
    const next: VisibilityState =
      typeof updater === "function" ? updater(columnVisibility) : updater;
    writePrefs(tableId, { ...readPrefs(tableId), columnVisibility: next });
  }

  function setColumnOrder(updater: string[] | ((prev: string[]) => string[])) {
    const next: string[] =
      typeof updater === "function" ? updater(columnOrder) : updater;
    writePrefs(tableId, { ...readPrefs(tableId), columnOrder: next });
  }

  function resetPreferences() {
    writePrefs(tableId, {
      columnVisibility: defaultVisibility,
      columnOrder: defaultOrder,
    });
  }

  return {
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    resetPreferences,
  };
}
