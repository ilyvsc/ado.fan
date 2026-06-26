"use client";

import { useDelete, useList } from "@refinedev/core";
import { Plus } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { useAdminTable } from "@/admin/hooks/use-data-table";

import { Button } from "@/components/ui/button";

import { DataTable } from "./DataTable";
import { DataTableToolbar } from "./toolbar/DataTableToolbar";

import type { ContextMenuAction, TableConfig } from "@/admin/types/data-table";

interface ResourceTableProps<TData extends { id: string }> {
  config: TableConfig<TData>;
  createHref?: string;
  title?: string;
  singular?: string;
  description?: string;
  basePath?: string;
  extraActions?: ContextMenuAction<TData>[];
}

export function ResourceTable<TData extends { id: string }>({
  config,
  createHref,
  title,
  singular,
  description,
  basePath,
  extraActions,
}: ResourceTableProps<TData>) {
  const router = useRouter();
  const { mutate: deleteOne } = useDelete();

  const resolvedBasePath = basePath ?? `/admin/${config.resource}`;
  const resolvedTitle = title ?? config.resource;

  const {
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
    setColumnOrder,
  } = useAdminTable<TData>({
    tableId: config.tableId ?? config.resource,
    columns: config.columns,
    filters: config.filters,
    defaultVisibility: config.defaultVisibility,
    pageSize: config.pageSize,
  });

  const {
    query: { isLoading },
    result,
  } = useList<TData>({
    resource: config.resource,
    pagination: { currentPage: current, pageSize },
    sorters: refineSorters,
    filters: refineFilters,
  });

  const listData = result.data;
  const total = result.total ?? 0;
  const pageCount = Math.ceil(total / pageSize);

  table.setOptions((prev) => ({ ...prev, data: listData }));

  const contextMenu = useMemo(
    () => ({
      resource: config.resource,
      basePath: resolvedBasePath,
      singular,
      getRowLabel: config.getRowLabel,
      extraActions,
      deleteWarning: config.deleteWarning,
      onDuplicate: config.duplicate,
    }),
    [
      config.resource,
      config.getRowLabel,
      config.deleteWarning,
      config.duplicate,
      resolvedBasePath,
      singular,
      extraActions,
    ],
  );

  const handleBulkDelete = useCallback(
    (rows: TData[]) => {
      rows.forEach((row) => {
        deleteOne({ resource: config.resource, id: row.id });
      });
    },
    [deleteOne, config.resource],
  );

  const handleRowClick = useCallback(
    (row: TData) => {
      router.push(`${resolvedBasePath}/${row.id}/edit`);
    },
    [router, resolvedBasePath],
  );

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {resolvedTitle}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : (description ?? `${total} ${config.resource} in the catalog`)}
          </p>
        </div>
        {createHref && (
          <Button
            asChild
            className="h-8 gap-1.5 rounded-md border-0 bg-ado-primary px-3 text-xs font-medium text-ado-primary-foreground hover:bg-ado-primary/90"
          >
            <Link href={createHref}>
              <Plus className="size-3.5" />
              Add {singular ?? resolvedTitle}
            </Link>
          </Button>
        )}
      </div>

      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        filters={config.filters}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFiltersClear={clearFilters}
        onResetPreferences={resetPreferences}
        onReorderColumns={setColumnOrder}
      />

      <DataTable
        table={table}
        isLoading={isLoading}
        contextMenu={contextMenu}
        emptyMessage={`No ${config.resource} yet`}
        onBulkDelete={handleBulkDelete}
        onRowClick={handleRowClick}
        current={current}
        pageCount={pageCount}
        total={total}
        onPageChange={setCurrent}
      />
    </div>
  );
}
