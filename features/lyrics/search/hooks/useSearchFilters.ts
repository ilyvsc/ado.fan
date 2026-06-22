"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { SongSortOption } from "@/types/song";

const URL_SYNC_DEBOUNCE_MS = 300;

export function useSearchFilters() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");

  const [sort, setSort] = useState<SongSortOption>(() => {
    const sort = searchParams.get("sort");
    return sort === "za" || sort === "newest" || sort === "oldest" ? sort : "az";
  });

  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    const year = searchParams.get("year");
    const number = year ? Number(year) : null;
    return number && !isNaN(number) ? number : null;
  });

  const [showSaved, setShowSaved] = useState(() => searchParams.get("saved") === "1");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (sort !== "az") params.set("sort", sort);
      if (selectedYear !== null) params.set("year", String(selectedYear));
      if (showSaved) params.set("saved", "1");
      const search = params.toString();
      const current = window.location.search.replace(/^\?/, "");
      if (search !== current) {
        window.history.replaceState(
          null,
          "",
          search ? `/lyrics?${search}` : "/lyrics",
        );
      }
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, sort, selectedYear, showSaved]);

  return {
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    selectedYear,
    setSelectedYear,
    showSaved,
    setShowSaved,
  };
}
