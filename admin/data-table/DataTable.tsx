"use client";

import { type Table } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableHeader } from "./columns/DataTableHeader";
import { DataTableRow } from "./rows/DataTableRow";
import { DataTableBulkBar } from "./toolbar/DataTableBulkBar";
import { DataTablePagination } from "./toolbar/DataTablePagination";

import type { BulkAction, ContextMenuConfig } from "@/admin/types/data-table";

interface DataTableProps<TData extends { id: string }> {
  table: Table<TData>;
  isLoading?: boolean;
  contextMenu?: ContextMenuConfig<TData>;
  emptyMessage?: string;
  onBulkDelete?: (rows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];
  onRowClick?: (row: TData) => void;
  current: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

function TableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, j) => (
            <TableCell key={j} className="p-4">
              <Skeleton className="h-4 w-full max-w-28 bg-foreground/6" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function DataTable<TData extends { id: string }>({
  table,
  isLoading,
  contextMenu,
  emptyMessage,
  onBulkDelete,
  bulkActions,
  onRowClick,
  current,
  pageCount,
  total,
  onPageChange,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  return (
    <div className="flex flex-col gap-2">
      <DataTableBulkBar
        table={table}
        onBulkDelete={onBulkDelete}
        bulkActions={bulkActions}
      />

      <div className="w-full overflow-hidden rounded-md border border-foreground/10">
        <ShadTable className="w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-foreground/2 hover:bg-foreground/5"
              >
                {headerGroup.headers.map((header) => (
                  <DataTableHeader key={header.id} header={header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columnCount={visibleColumns.length} />
            ) : rows.length === 0 ? (
              <TableRow className="text-center">
                <TableCell colSpan={visibleColumns.length}>{emptyMessage}</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  contextMenu={contextMenu}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </TableBody>
        </ShadTable>
      </div>

      <DataTablePagination
        current={current}
        pageCount={pageCount}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
