"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
  current: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  current,
  pageCount,
  total,
  onPageChange,
}: DataTablePaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        Page {current} of {pageCount}
        <span className="ml-1 text-muted-foreground/60">({total} total)</span>
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className={cn("h-7", current === 1 && "hidden")}
          disabled={current === 1}
          onClick={() => {
            onPageChange(Math.max(1, current - 1));
          }}
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden text-xs md:inline">Previous</span>
        </Button>
        <Button
          variant="ghost"
          className={cn("h-7", current === pageCount && "hidden")}
          disabled={current === pageCount}
          onClick={() => {
            onPageChange(Math.min(pageCount, current + 1));
          }}
        >
          <span className="hidden text-xs md:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
