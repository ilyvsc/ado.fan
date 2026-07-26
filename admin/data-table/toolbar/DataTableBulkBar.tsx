"use client";

import { type Table } from "@tanstack/react-table";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmDialog } from "@/admin/components/ui/DeleteConfirmDialog";
import { type BulkAction } from "@/admin/types/data-table";
import { cn } from "@/lib/utils";

interface DataTableBulkBarProps<TData> {
  table: Table<TData>;
  onBulkDelete?: (rows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];
}

export function DataTableBulkBar<TData>({
  table,
  onBulkDelete,
  bulkActions,
}: DataTableBulkBarProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows;
  const count = selectedRows.length;
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirmDelete() {
    if (!onBulkDelete) return;
    const rows = selectedRows.map((r) => r.original);
    onBulkDelete(rows);
    table.resetRowSelection();
    setConfirmOpen(false);
    toast.success(`${rows.length} ${rows.length === 1 ? "item" : "items"} deleted`);
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-200",
          count > 0
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <div className="flex items-center gap-1 rounded-xl border border-foreground/12 bg-background p-1 md:p-2">
          <span className="w-24 min-w-0 px-3 text-xs font-medium text-foreground tabular-nums md:w-full md:text-sm">
            {count} selected
          </span>

          <div className="mx-1 h-4 w-px bg-foreground/30" />

          {bulkActions?.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick(
                    selectedRows.map((r) => r.original),
                    () => {
                      table.resetRowSelection();
                    },
                  );
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  action.variant === "destructive"
                    ? "text-destructive hover:bg-destructive/8"
                    : "text-foreground hover:bg-foreground/6",
                )}
              >
                <Icon className="size-3.5" />
                {action.label}
              </button>
            );
          })}

          {onBulkDelete && (
            <button
              onClick={() => {
                setConfirmOpen(true);
              }}
              className="text-destructive hover:bg-destructive/8 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          )}

          <button
            onClick={() => {
              table.resetRowSelection();
            }}
            className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
            aria-label="Clear selection"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${count} ${count === 1 ? "item" : "items"}?`}
        description={`This will permanently delete ${count} selected ${count === 1 ? "item" : "items"}. This action cannot be undone.`}
      />
    </>
  );
}
