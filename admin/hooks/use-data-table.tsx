"use client";

import { CrudFilter } from "@refinedev/core";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSizingState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { useCallback, useMemo, useState } from "react";

import { filtersToCrud } from "@/admin/lib/filters";
import {
  type ActiveFilterValue,
  type ActiveFilters,
  type FilterDef,
} from "@/admin/types/filters";
import { Checkbox } from "@/components/ui/checkbox";

import { useDebouncedValue } from "./use-debounced-value";
import { useTablePreferences } from "./use-table-preferences";

function SelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => {
          table.toggleAllPageRowsSelected(!!v);
        }}
        aria-label="Select all"
        className="border-foreground/20 text-ado-primary-foreground data-[state=checked]:bg-ado-primary"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => {
          row.toggleSelected(!!v);
        }}
        aria-label="Select row"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="border-foreground/20 text-ado-primary-foreground data-[state=checked]:bg-ado-primary"
      />
    ),
  };
}

interface UseAdminTableOptions<TData> {
  tableId: string;
  columns: ColumnDef<TData>[];
  filters?: FilterDef[];
  defaultVisibility?: VisibilityState;
  pageSize?: number;
}

export function useAdminTable<TData>({
  tableId,
  columns,
  filters: filterDefs = [],
  defaultVisibility = {},
  pageSize = 20,
}: UseAdminTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearchRaw] = useState("");
  const [current, setCurrent] = useState(1);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setCurrent(1);
  }, []);

  const setFilter = useCallback((id: string, value: ActiveFilterValue) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === null) {
        Reflect.deleteProperty(next, id);
      } else {
        next[id] = value;
      }
      return next;
    });
    setCurrent(1);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setCurrent(1);
  }, []);

  const allColumns = useMemo<ColumnDef<TData>[]>(
    () => [SelectColumn<TData>(), ...columns],
    [columns],
  );

  const defaultOrder = useMemo(
    () =>
      allColumns.map((c) => {
        const col = c as { id?: string; accessorKey?: string };
        return col.id ?? col.accessorKey ?? "";
      }),
    [allColumns],
  );

  const {
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    resetPreferences,
  } = useTablePreferences(tableId, defaultVisibility, defaultOrder);

  const refineSorters = useMemo(
    () =>
      sorting.map((s) => ({
        field: s.id,
        order: s.desc ? ("desc" as const) : ("asc" as const),
      })),
    [sorting],
  );

  // React Compiler safely skips memoizing this hook (v8 builder API).
  // No stale UI since nothing here is memoized downstream.
  // Real fix is the v9 @tanstack/react-table.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    data: [],
    columns: allColumns,
    state: { sorting, columnVisibility, columnSizing, columnOrder },
    onSortingChange: (updater) => {
      setSorting(updater);
      setCurrent(1);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const debouncedSearch = useDebouncedValue(search, 300);

  const refineFilters = useMemo(() => {
    const filters: CrudFilter[] = [];
    if (debouncedSearch) {
      filters.push({
        field: "q",
        operator: "contains",
        value: debouncedSearch,
      });
    }
    if (filterDefs.length > 0) {
      filters.push(...filtersToCrud(filterDefs, activeFilters));
    }
    return filters;
  }, [debouncedSearch, filterDefs, activeFilters]);

  return {
    table,
    refineSorters,
    refineFilters,
    search,
    setSearch,
    activeFilters,
    setFilter,
    clearFilters,
    current,
    setCurrent,
    pageSize,
    resetPreferences,
    columnOrder,
    setColumnOrder,
  };
}
