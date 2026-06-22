"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (updater: (prev: T) => T) => void] {
  const [stableFallback] = useState(fallback);

  const getSnapshot = useCallback(() => localStorage.getItem(key), [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value = useMemo(() => {
    if (raw === null) return stableFallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return stableFallback;
    }
  }, [raw, stableFallback]);

  const update = useCallback(
    (updater: (prev: T) => T) => {
      const next = updater(readStorage(key, stableFallback));
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, stableFallback],
  );

  return [value, update];
}
