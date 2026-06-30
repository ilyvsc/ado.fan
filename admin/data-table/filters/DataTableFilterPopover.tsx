"use client";

import { getFilterSummary } from "@/admin/lib/filters";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FilterControl, isFilterActive } from "./DataTableFilters";

import type { ActiveFilterValue, FilterDef } from "@/admin/types/filters";

interface Props {
  def: FilterDef;
  value: ActiveFilterValue;
  onChange: (v: ActiveFilterValue) => void;
  onClear: () => void;
}

export function DataTableFilterPopover({ def, value, onChange, onClear }: Props) {
  const active = isFilterActive(value);
  const Icon = def.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
            active
              ? "border-ado-primary/40 bg-ado-primary/8 text-ado-primary hover:bg-ado-primary/12"
              : "border-foreground/12 bg-background text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          {Icon && <Icon className="size-3.5" />}
          {def.label}
          {active && (
            <span className="inline-flex max-w-20 items-center truncate rounded-md border border-ado-primary/25 bg-ado-primary/10 px-1.5 py-0.5 text-ado-primary">
              {getFilterSummary(def, value)}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-56 rounded-lg border border-foreground/10 bg-background p-3"
      >
        <FilterControl
          def={def}
          value={value ?? null}
          onChange={onChange}
          onClear={onClear}
        />
      </PopoverContent>
    </Popover>
  );
}
