import { type CrudFilter } from "@refinedev/core";
import { User } from "lucide-react";

import type {
  ActiveFilterValue,
  ActiveFilters,
  FilterDef,
} from "@/admin/types/data-table";

export function matchesSearch(
  search: string,
  ...fields: (string | null | undefined)[]
): boolean {
  if (!search) return true;
  return fields.some((f) => (f ?? "").toLowerCase().includes(search));
}

export function matchesSelect(active: ActiveFilterValue, value: string): boolean {
  return typeof active !== "string" || active === value;
}

export function matchesSelectIn(
  active: ActiveFilterValue,
  candidates: string[],
): boolean {
  return typeof active !== "string" || candidates.includes(active);
}

export function filtersToCrud(
  filters: FilterDef[],
  active: ActiveFilters,
): CrudFilter[] {
  const result: CrudFilter[] = [];

  for (const def of filters) {
    const value = active[def.id];
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    )
      continue;

    switch (def.type) {
      case "search":
        result.push({ field: def.field, operator: "contains", value });
        break;
      case "select":
        result.push({ field: def.field, operator: "eq", value });
        break;
      case "multi-select":
      case "checkbox-group":
        result.push({ field: def.field, operator: "in", value });
        break;
      case "switch":
        if (value === true)
          result.push({ field: def.field, operator: "eq", value: true });
        break;
      case "year-range": {
        const [min, max] = value as [number, number];
        result.push({ field: def.field, operator: "gte", value: min });
        result.push({ field: def.field, operator: "lte", value: max });
        break;
      }
      case "slider": {
        const [min, max] = value as [number, number];
        result.push({ field: def.field, operator: "gte", value: min });
        result.push({ field: def.field, operator: "lte", value: max });
        break;
      }
      case "date":
        result.push({ field: def.field, operator: "eq", value });
        break;
      case "date-range": {
        const [from, to] = value as [string, string];
        if (from) result.push({ field: def.field, operator: "gte", value: from });
        if (to) result.push({ field: def.field, operator: "lte", value: to });
        break;
      }
    }
  }

  return result;
}

export function countActiveFilters(active: ActiveFilters): number {
  return Object.values(active).filter((v) => {
    if (v === null || v === undefined || v === false || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
}

export function getFilterSummary(def: FilterDef, value: ActiveFilterValue): string {
  switch (def.type) {
    case "search":
      return String(value);
    case "select":
      return def.options?.find((o) => o.value === value)?.label ?? String(value);
    case "multi-select":
    case "checkbox-group":
      return (value as string[]).join(", ");
    case "switch":
      return value ? "Yes" : "No";
    case "year-range": {
      const [min, max] = value as [number, number];
      return min === max ? String(min) : `${min}-${max}`;
    }
    case "slider": {
      const [min, max] = value as [number, number];
      const unit = (def as { unit?: string }).unit ?? "";
      return `${min}${unit}-${max}${unit}`;
    }
    case "date":
      return String(value);
    case "date-range": {
      const [from, to] = value as [string, string];
      if (from && to) return `${from} → ${to}`;
      if (from) return `from ${from}`;
      return `until ${to}`;
    }
    default:
      return String(value);
  }
}

export function userSelectFilter(
  users: { id: string; name: string; image?: string | null }[],
  opts: { id?: string; label?: string } = {},
): FilterDef {
  const id = opts.id ?? "user";
  const byId = new Map<
    string,
    { value: string; label: string; image: string | null }
  >();
  for (const u of users) {
    if (u.id && !byId.has(u.id)) {
      byId.set(u.id, { value: u.id, label: u.name, image: u.image ?? null });
    }
  }
  return {
    id,
    label: opts.label ?? "User",
    field: id,
    type: "select",
    icon: User,
    options: [...byId.values()],
  };
}
