"use client";

import { flexRender, type Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { DataTableContextMenu } from "./DataTableContextMenu";

import type { ContextMenuConfig } from "@/admin/types/data-table";

interface DataTableRowProps<TData extends { id: string }> {
  row: Row<TData>;
  contextMenu?: ContextMenuConfig<TData>;
  onRowClick?: (row: TData) => void;
}

export function DataTableRow<TData extends { id: string }>({
  row,
  contextMenu,
  onRowClick,
}: DataTableRowProps<TData>) {
  const tableRow = (
    <TableRow
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn(
        "group transition-colors data-[state=selected]:bg-ado-primary/10",
        onRowClick ? "cursor-pointer" : "cursor-default",
      )}
      onClick={() => onRowClick?.(row.original)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={
            cell.column.getCanResize()
              ? { minWidth: `${cell.column.getSize()}px` }
              : undefined
          }
          className="overflow-hidden px-4 py-2"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );

  if (contextMenu) {
    return (
      <DataTableContextMenu
        row={row.original}
        resource={contextMenu.resource}
        basePath={contextMenu.basePath}
        getRowLabel={contextMenu.getRowLabel ?? ((r) => r.id)}
        extraActions={contextMenu.extraActions}
        deleteWarning={contextMenu.deleteWarning}
        isSelected={row.getIsSelected()}
        onSelectToggle={() => {
          row.toggleSelected();
        }}
        onDuplicate={contextMenu.onDuplicate}
      >
        {tableRow}
      </DataTableContextMenu>
    );
  }

  return tableRow;
}
