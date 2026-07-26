"use client";

import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import type { ActiveFilterValue, FilterDef } from "@/admin/types/filters";
import type { LucideIcon } from "lucide-react";

export function isFilterActive(value: unknown) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function FilterLabel({
  label,
  icon: Icon,
  hasValue,
  onClear,
}: {
  label: string;
  icon?: LucideIcon;
  hasValue: boolean;
  onClear: () => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
        {Icon && <Icon className="size-3.5 text-muted-foreground" />}
        {label}
      </span>
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
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon?: LucideIcon;
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
        {Icon && <Icon className="size-3.5" />}
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

export function SelectFilter({
  def,
  value,
  onChange,
  onClear,
}: {
  def: FilterDef & { type: "select" };
  value: string | null;
  onChange: (v: ActiveFilterValue) => void;
  onClear: () => void;
}) {
  const options = def.options ?? [];
  return (
    <div>
      <FilterLabel
        label={def.label}
        icon={def.icon}
        hasValue={!!value}
        onClear={onClear}
      />
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => {
                if (active) onClear();
                else onChange(opt.value);
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                active
                  ? "bg-ado-primary font-medium text-ado-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {opt.image !== undefined && (
                <Avatar className="size-5 shrink-0">
                  {opt.image && <AvatarImage src={opt.image} alt="" />}
                  <AvatarFallback className="text-[8px]">
                    {opt.label.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
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
    case "select":
      return (
        <SelectFilter
          def={def}
          value={(value as string | null) ?? null}
          onChange={onChange}
          onClear={onClear}
        />
      );
    case "switch":
      return (
        <SwitchFilter
          label={def.label}
          icon={def.icon}
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
      <FilterLabel
        label={def.label}
        icon={def.icon}
        hasValue={isActive}
        onClear={onClear}
      />
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
