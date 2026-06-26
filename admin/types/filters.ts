export interface ListFilter {
  field: string;
  operator: string;
  value: unknown;
}

interface BaseFilterDef {
  id: string;
  label: string;
  description?: string;
  field: string;
}

export type FilterDef = BaseFilterDef &
  (
    | { type: "search" }
    | { type: "select"; options?: { label: string; value: string }[] }
    | { type: "multi-select"; options?: { label: string; value: string }[] }
    | { type: "checkbox-group"; options?: { label: string; value: string }[] }
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
