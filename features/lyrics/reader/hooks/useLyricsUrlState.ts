"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type {
  LyricsUrlState,
  LyricsViewMode,
} from "@/features/lyrics/types/states";
import type { Language } from "@/types/lyrics";

export function useLyricsUrlState({
  availableLanguages,
}: {
  availableLanguages: Language[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const codes = useMemo(
    () => availableLanguages.map((l) => l.code),
    [availableLanguages],
  );

  const defaults = useMemo(() => {
    const [first = "ja", second = first] = codes;
    return {
      left: first,
      right: second,
      mode: "compare" as const,
    };
  }, [codes]);

  const normalize = useCallback(
    (raw: { get(key: string): string | null }): LyricsUrlState => {
      const valid = (c: string | null) =>
        c && codes.includes(c) ? c : undefined;

      const lang = valid(raw.get("lang"));
      const leftParam = valid(raw.get("left"));
      const rightParam = valid(raw.get("right"));
      const modeParam = raw.get("mode");

      if (lang) {
        return {
          mode: "tabs",
          left: lang,
          right: rightParam ?? defaults.right,
        };
      }

      const left = leftParam ?? defaults.left;
      let right = rightParam ?? defaults.right;

      if (left === right && codes.length > 1) {
        right = codes.find((c) => c !== left)!;
      }

      const mode: LyricsViewMode = modeParam === "lined" ? "lined" : "compare";

      return { mode, left, right };
    },
    [codes, defaults],
  );

  const state = useMemo(
    () => normalize(searchParams),
    [searchParams, normalize],
  );

  const updateUrl = useCallback(
    (next: Partial<LyricsUrlState> & { mode?: LyricsViewMode }) => {
      const s = { ...state, ...next };
      const params = new URLSearchParams(searchParams.toString());

      params.delete("lang");
      params.delete("left");
      params.delete("right");
      params.delete("mode");

      if (s.mode === "tabs") {
        params.set("lang", s.left);
      } else {
        params.set("left", s.left);
        params.set("right", s.right);
        if (s.mode === "lined") {
          params.set("mode", "lined");
        }
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, state, searchParams],
  );

  const isTwoLangMode = state.mode === "compare" || state.mode === "lined";

  return {
    state,
    languages: availableLanguages,
    setMode: (mode: LyricsViewMode) => { updateUrl({ mode }); },
    setLeft: (code: string) =>
      codes.includes(code) &&
      updateUrl(
        isTwoLangMode && code === state.right
          ? { left: code, right: state.left }
          : { left: code },
      ),
    setRight: (code: string) =>
      codes.includes(code) &&
      updateUrl(
        isTwoLangMode && code === state.left
          ? { left: state.right, right: code }
          : { right: code },
      ),
    swapLanguages: () =>
      isTwoLangMode && updateUrl({ left: state.right, right: state.left }),
  };
}
