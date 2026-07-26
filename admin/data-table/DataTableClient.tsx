"use client";

import { useMemo } from "react";

import { useAdminTable } from "@/admin/hooks/use-data-table";
import { sortData } from "@/admin/lib/table-sort";

import { DataTable } from "./DataTable";
import { DataTableToolbar } from "./toolbar";

import type { BulkAction, ClientTableConfig } from "@/admin/types/data-table";

interface Props<T extends { id: string }> {
  config: ClientTableConfig<T>;
  data: T[];
  bulkActions?: BulkAction<T>[];
}

export function DataTableClient<T extends { id: string }>({
  config,
  data,
  bulkActions,
}: Props<T>) {
  const filters = useMemo(() => config.buildFilters?.(data), [config, data]);

  const {
    table,
    search,
    setSearch,
    activeFilters,
    setFilter,
    clearFilters,
    current,
    setCurrent,
    pageSize,
    resetPreferences,
    setColumnOrder,
  } = useAdminTable<T>({
    tableId: config.tableId,
    columns: config.columns,
    filters,
    defaultVisibility: config.defaultVisibility,
  });

  const q = search.toLowerCase();
  const rowFilter = config.filter;
  const filtered = rowFilter
    ? data.filter((row) => rowFilter(row, { search: q, activeFilters }))
    : data;

  const sorted = sortData(filtered, table.getState().sorting);
  const pageCount = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((current - 1) * pageSize, current * pageSize);

  table.setOptions((prev) => ({ ...prev, data: paged }));

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFiltersClear={clearFilters}
        onResetPreferences={resetPreferences}
        onReorderColumns={setColumnOrder}
      />
      <DataTable
        table={table}
        current={current}
        pageCount={pageCount}
        total={filtered.length}
        onPageChange={setCurrent}
        emptyMessage={config.emptyMessage}
        bulkActions={bulkActions}
      />
    </div>
  );
}
