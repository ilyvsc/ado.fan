"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ActiveFilterValue, FilterDef } from "@/admin/types/filters";

export function isFilterActive(value: unknown) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function FilterLabel({
  label,
  hasValue,
  onClear,
}: {
  label: string;
  hasValue: boolean;
  onClear: () => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {hasValue && (
        <button
          onClick={onClear}
          className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" /> Clear
        </button>
      )}
    </div>
  );
}

export function SwitchFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  function handleCycle() {
    if (value === null) onChange(true);
    else if (value) onChange(false);
    else onChange(null);
  }

  const stateLabel = value === true ? "Yes" : value === false ? "No" : null;

  return (
    <button
      onClick={handleCycle}
      className={cn(
        "h-8 gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
        value !== null
          ? "border-ado-primary/40 bg-ado-primary/8 text-ado-primary hover:bg-ado-primary/12"
          : "border-foreground/12 bg-background text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {stateLabel && (
          <span className="inline-flex items-center rounded-md border border-ado-primary/25 bg-ado-primary/10 px-1.5 py-0.5 text-ado-primary">
            {stateLabel}
          </span>
        )}
      </span>
    </button>
  );
}

export function FilterControl({
  def,
  value,
  onChange,
  onClear,
}: {
  def: FilterDef;
  value: ActiveFilterValue;
  onChange: (v: ActiveFilterValue) => void;
  onClear: () => void;
}) {
  switch (def.type) {
    case "switch":
      return (
        <SwitchFilter
          label={def.label}
          value={(value as boolean | null) ?? null}
          onChange={(v) => {
            if (v === null) onClear();
            else onChange(v);
          }}
        />
      );
    case "year-range":
      return (
        <YearRangeFilter
          def={def}
          value={value as [number, number] | null}
          onChange={onChange}
          onClear={onClear}
        />
      );
    default:
      return null;
  }
}

export function YearRangeFilter({
  def,
  value,
  onChange,
  onClear,
}: {
  def: FilterDef & { type: "year-range" };
  value: [number, number] | null;
  onChange: (v: ActiveFilterValue) => void;
  onClear: () => void;
}) {
  const min = def.min;
  const max = def.max;

  const [start, end] = value ?? [min, max];

  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const isActive = !!value && (start !== min || end !== max);

  function toggleYear(year: number) {
    if (!value) {
      onChange([year, year]);
      return;
    }

    if (year >= start && year <= end) {
      if (start === end) {
        onClear();
        return;
      }
      onChange([year, year]);
      return;
    }

    onChange([Math.min(start, year), Math.max(end, year)]);
  }

  return (
    <div>
      <FilterLabel label={def.label} hasValue={isActive} onClear={onClear} />
      <div className="grid grid-cols-3 gap-1">
        {years.map((year) => {
          const isEdge = value && (year === start || year === end);
          const inRange = value && year >= start && year <= end;

          return (
            <button
              key={year}
              onClick={() => {
                toggleYear(year);
              }}
              className={cn(
                "rounded-md px-2 py-1.5 text-xs tabular-nums transition-colors",
                isEdge
                  ? "bg-ado-primary font-medium text-ado-primary-foreground"
                  : inRange
                    ? "bg-ado-primary/20 font-medium text-ado-primary"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}
