import type { LucideIcon } from "lucide-react";

export interface ListFilter {
  field: string;
  operator: string;
  value: unknown;
}

export interface FilterOption {
  label: string;
  value: string;
  image?: string | null;
}

interface BaseFilterDef {
  id: string;
  label: string;
  description?: string;
  field: string;
  icon?: LucideIcon;
}

export type FilterDef = BaseFilterDef &
  (
    | { type: "search" }
    | { type: "select"; options?: FilterOption[] }
    | { type: "multi-select"; options?: FilterOption[] }
    | { type: "checkbox-group"; options?: FilterOption[] }
    | { type: "switch" }
    | { type: "year-range"; min: number; max: number }
    | { type: "slider"; min: number; max: number; unit?: string }
    | { type: "date" }
    | { type: "date-range" }
  );

export type ActiveFilterValue =
  | string
  | string[]
  | boolean
  | [number, number]
  | [string, string]
  | null
  | undefined;

export type ActiveFilters = Record<string, ActiveFilterValue>;
