"use client";

import { type Table } from "@tanstack/react-table";
import { ArrowUpDown, Search, X } from "lucide-react";

import { countActiveFilters, getFilterSummary } from "@/admin/lib/filters";
import {
  type ActiveFilterValue,
  type ActiveFilters,
  type FilterDef,
} from "@/admin/types/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { DataTableColumnToggle } from "../columns/DataTableColumnToggle";
import { DataTableFilterPopover } from "../filters/DataTableFilterPopover";
import { isFilterActive } from "../filters/DataTableFilters";
import { DataTableFilterSheet } from "../filters/DataTableFilterSheet";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterDef[];
  activeFilters: ActiveFilters;
  onFilterChange: (id: string, value: ActiveFilterValue) => void;
  onFiltersClear: () => void;
  onResetPreferences: () => void;
  onReorderColumns?: (order: string[]) => void;
  lockedColumnIds?: string[];
}

export function DataTableToolbar<TData>({
  table,
  search = "",
  onSearchChange,
  filters = [],
  activeFilters,
  onFilterChange,
  onFiltersClear,
  onResetPreferences,
  onReorderColumns,
  lockedColumnIds,
}: DataTableToolbarProps<TData>) {
  const nonSearchFilters = filters.filter((f) => f.type !== "search");
  const simpleFilters = nonSearchFilters.filter((f) => "simple" in f && f.simple);
  const complexFilters = nonSearchFilters.filter((f) => !("simple" in f && f.simple));

  const totalActive = countActiveFilters(activeFilters);
  const activeSorts = table.getState().sorting;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange !== undefined && (
          <div className="relative max-w-xs min-w-48 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              placeholder="Search..."
              className="h-8 rounded-md border border-foreground/12 bg-background pl-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:ring-0 focus-visible:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                }}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {simpleFilters.map((def) => (
          <DataTableFilterPopover
            key={def.id}
            def={def}
            value={activeFilters[def.id] ?? null}
            onChange={(v) => {
              onFilterChange(def.id, v);
            }}
            onClear={() => {
              onFilterChange(def.id, null);
            }}
          />
        ))}

        <DataTableFilterSheet
          filters={complexFilters}
          activeFilters={activeFilters}
          onSetFilter={onFilterChange}
          onClearFilter={(id) => {
            onFilterChange(id, null);
          }}
          onClearAll={onFiltersClear}
        />

        {activeSorts.length > 0 && (
          <button
            onClick={() => {
              table.resetSorting();
            }}
            className="hidden h-8 items-center gap-1.5 rounded-md border border-foreground/12 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground md:flex"
          >
            <ArrowUpDown className="size-3.5" />
            {activeSorts
              .map((sort) => {
                const header = table.getColumn(sort.id)?.columnDef.header;
                return typeof header === "string"
                  ? header
                  : sort.id.charAt(0).toUpperCase() + sort.id.slice(1);
              })
              .join(", ")}
            <X className="size-3 opacity-60" />
          </button>
        )}

        <DataTableColumnToggle
          table={table as Table<unknown>}
          lockedColumnIds={lockedColumnIds}
          onResetAction={onResetPreferences}
          onReorderAction={onReorderColumns ?? (() => undefined)}
        />
      </div>

      {totalActive > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>

          {filters
            .filter((f) => isFilterActive(activeFilters[f.id]))
            .map((f) => (
              <Badge
                key={f.id}
                className="flex cursor-default items-center gap-1 rounded-md border border-foreground/12 bg-foreground/5 px-2 py-0.5 text-xs font-normal text-foreground"
              >
                <span className="text-muted-foreground">{f.label}:</span>
                {getFilterSummary(f, activeFilters[f.id])}
                <button
                  onClick={() => {
                    onFilterChange(f.id, null);
                  }}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}

          <button
            onClick={onFiltersClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
