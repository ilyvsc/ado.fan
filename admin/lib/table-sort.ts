import type { SortingState } from "@tanstack/react-table";

export function sortData<T>(data: T[], sorting: SortingState): T[] {
  if (!sorting.length) return data;
  return [...data].sort((a, b) => {
    for (const { id, desc } of sorting) {
      const av = (a as Record<string, unknown>)[id];
      const bv = (b as Record<string, unknown>)[id];
      let cmp = 0;
      if (av instanceof Date && bv instanceof Date) {
        cmp = av.getTime() - bv.getTime();
      } else if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = ((av ?? "") as string).localeCompare((bv ?? "") as string);
      }
      if (cmp !== 0) return desc ? -cmp : cmp;
    }
    return 0;
  });
}
