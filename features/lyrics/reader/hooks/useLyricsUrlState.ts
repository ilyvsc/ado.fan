"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { LyricsUrlState } from "@/features/lyrics/types/states";
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

      if (lang) {
        return {
          mode: "tabs",
          left: lang,
          right: rightParam ?? defaults.right,
        };
      }

      let left = leftParam ?? defaults.left;
      let right = rightParam ?? defaults.right;

      if (left === right && codes.length > 1) {
        right = codes.find((c) => c !== left)!;
      }

      return { mode: "compare", left, right };
    },
    [codes, defaults],
  );

  const state = useMemo(
    () => normalize(searchParams),
    [searchParams, normalize],
  );

  const updateUrl = useCallback(
    (next: Partial<LyricsUrlState> & { mode?: "tabs" | "compare" }) => {
      const s = { ...state, ...next };
      const params = new URLSearchParams(searchParams.toString());

      params.delete("lang");
      params.delete("left");
      params.delete("right");

      if (s.mode === "tabs") {
        params.set("lang", s.left);
      } else {
        params.set("left", s.left);
        params.set("right", s.right);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, state, searchParams],
  );

  return {
    state,
    languages: availableLanguages,
    setMode: (mode: "tabs" | "compare") => updateUrl({ mode }),
    setLeft: (code: string) =>
      codes.includes(code) &&
      updateUrl(
        state.mode === "compare" && code === state.right
          ? { left: code, right: state.left }
          : { left: code },
      ),
    setRight: (code: string) =>
      codes.includes(code) &&
      updateUrl(
        state.mode === "compare" && code === state.left
          ? { left: state.right, right: code }
          : { right: code },
      ),
    swapLanguages: () =>
      state.mode === "compare" &&
      updateUrl({ left: state.right, right: state.left }),
  };
}
