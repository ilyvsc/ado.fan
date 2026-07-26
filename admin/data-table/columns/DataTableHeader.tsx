"use client";

import { flexRender, type Header } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { type ReactNode } from "react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function SortableHeader({
  column,
  children,
}: {
  column: {
    toggleSorting: (asc: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
  children: ReactNode;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      onClick={() => {
        column.toggleSorting(sorted === "asc");
      }}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
      {sorted === "asc" ? (
        <ChevronUp className="size-3" />
      ) : sorted === "desc" ? (
        <ChevronDown className="size-3" />
      ) : (
        <ArrowUpDown className="size-3 opacity-50" />
      )}
    </button>
  );
}

function HeaderContent<TData>({ header }: { header: Header<TData, unknown> }) {
  if (header.isPlaceholder) return null;

  const { header: headerDef } = header.column.columnDef;

  if (typeof headerDef !== "string") {
    return flexRender(headerDef, header.getContext());
  }

  if (header.column.columnDef.enableSorting !== false) {
    return <SortableHeader column={header.column}>{headerDef}</SortableHeader>;
  }

  return headerDef;
}

export function DataTableHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  return (
    <TableHead
      style={
        header.column.getCanResize()
          ? { minWidth: `${header.getSize()}px` }
          : undefined
      }
      className={cn(
        "relative h-9 text-xs font-medium text-muted-foreground",
        !header.column.getCanResize() &&
          "after:absolute after:top-1/2 after:right-0 after:h-4 after:w-px after:-translate-y-1/2 after:bg-foreground/8 first:after:hidden last:after:hidden",
      )}
    >
      <HeaderContent header={header} />
      {header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className="group/resize absolute top-0 -right-1.5 z-10 flex h-full w-3 cursor-col-resize touch-none items-center justify-center select-none"
        >
          <div
            className={cn(
              "h-4 w-px transition-colors group-hover/resize:bg-ado-primary",
              header.column.getIsResizing() ? "bg-ado-primary" : "bg-foreground/8",
            )}
          />
        </div>
      )}
    </TableHead>
  );
}
