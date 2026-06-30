import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "right";
  className?: string;
}

function DataList<T>({
  columns,
  rows,
  rowKey,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{empty ?? "Nothing here yet."}</p>
    );
  }

  return (
    <Table className="w-auto min-w-full">
      <TableHeader>
        <TableRow className="divide-x divide-foreground/10">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                "h-9 px-3 text-xs",
                col.align === "right" && "text-right",
                col.className,
              )}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={rowKey(row)} className="divide-x divide-foreground/10">
            {columns.map((col) => (
              <TableCell
                key={col.key}
                className={cn(
                  "px-3 py-2",
                  col.align !== "right" && "max-w-0 overflow-hidden",
                  col.align === "right" && "text-right",
                  col.className,
                )}
              >
                {col.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { type Column, DataList };
