"use client";

import { SlidersHorizontal } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { FilterControl, isFilterActive } from "./DataTableFilters";

import type {
  ActiveFilterValue,
  ActiveFilters,
  FilterDef,
} from "@/admin/types/data-table";

interface Props {
  filters: FilterDef[];
  activeFilters: ActiveFilters;
  onSetFilter: (id: string, v: ActiveFilterValue) => void;
  onClearFilter: (id: string) => void;
  onClearAll: () => void;
}

export function DataTableFilterSheet({
  filters,
  activeFilters,
  onSetFilter,
  onClearFilter,
  onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);

  const activeCount = filters.filter((f) =>
    isFilterActive(activeFilters[f.id]),
  ).length;

  if (!filters.length) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 gap-1.5 rounded-md border px-3 text-xs font-medium ${
            activeCount
              ? "border-ado-primary/40 bg-ado-primary/8 text-ado-primary"
              : "border-foreground/12 bg-background text-muted-foreground"
          }`}
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-ado-primary text-xs text-ado-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 border-l border-foreground/10 bg-background p-0"
      >
        <SheetHeader className="border-b border-foreground/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-semibold text-foreground">
              Filters
            </SheetTitle>
            {activeCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
          {filters.map((def, i) => (
            <div key={def.id}>
              {i > 0 && <Separator className="mb-5 bg-foreground/6" />}
              {def.description && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {def.description}
                </p>
              )}
              <FilterControl
                def={def}
                value={activeFilters[def.id] ?? null}
                onChange={(v) => {
                  onSetFilter(def.id, v);
                }}
                onClear={() => {
                  onClearFilter(def.id);
                }}
              />
            </div>
          ))}
        </div>

        <div className="border-t border-foreground/10 px-5 py-4">
          <Button
            size="sm"
            className="h-8 w-full bg-ado-primary text-xs font-medium text-ado-primary-foreground"
            onClick={() => {
              setOpen(false);
            }}
          >
            Apply filters
            {activeCount > 0 && ` (${activeCount})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
