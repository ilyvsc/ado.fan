import { cn } from "@/lib/utils";

import { type ParseableSchema } from "../validation";
import { RenderField } from "./FormFields";

import type { FieldGroup } from "@/admin/types/forms";

export function FormGroup({
  group,
  control,
  schema,
}: {
  group: FieldGroup;
  control: unknown;
  schema?: ParseableSchema;
}) {
  const explicitCols = group.cols;
  const autoCols = Math.min(group.fields.length, 3);
  const count = explicitCols ?? autoCols;

  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="flex flex-col gap-3">
      {group.title && (
        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          {group.title}
        </p>
      )}
      <div className={cn("grid gap-4", gridClass)}>
        {group.fields.map((field) => (
          <div
            key={field.name}
            className={cn(
              field.span === 2 && "md:col-span-2",
              field.span === 3 && "md:col-span-3",
            )}
          >
            <RenderField field={field} control={control} schema={schema} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Placed {
  group: FieldGroup;
  col: number;
  row: number;
}

function placeGroups(groups: FieldGroup[]): Placed[] {
  const free = groups.filter((g) => !g.col);
  const pinned1 = groups.filter((g) => g.col === 1);
  const pinned2 = groups.filter((g) => g.col === 2);

  const half = Math.ceil(free.length / 2);
  const col1 = [...pinned1, ...free.slice(0, half)];
  const col2 = [...pinned2, ...free.slice(half)];

  const placed: Placed[] = [];

  let next1 = 1;
  for (const g of col1) {
    const row = g.row ?? next1;
    placed.push({ group: g, col: 1, row });
    next1 = Math.max(next1, row) + 1;
  }

  let next2 = 1;
  for (const g of col2) {
    const row = g.row ?? next2;
    placed.push({ group: g, col: 2, row });
    next2 = Math.max(next2, row) + 1;
  }

  return placed;
}

export function GroupsLayout({
  groups,
  control,
  schema,
  columns = 1,
}: {
  groups: FieldGroup[];
  control: unknown;
  schema?: ParseableSchema;
  columns?: 1 | 2;
}) {
  const key = (g: FieldGroup) => g.fields.map((f) => f.name).join("-");

  if (columns === 1) {
    return (
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <FormGroup
            key={key(group)}
            group={group}
            control={control}
            schema={schema}
          />
        ))}
      </div>
    );
  }

  const wide = groups.filter((g) => g.fullWidth);
  const placed = placeGroups(groups.filter((g) => !g.fullWidth));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid max-w-6xl grid-cols-2 items-start gap-x-6 gap-y-6">
        {placed.map(({ group, col, row }) => (
          <div key={key(group)} style={{ gridColumn: col, gridRow: row }}>
            <FormGroup group={group} control={control} schema={schema} />
          </div>
        ))}
      </div>
      {wide.map((group) => (
        <FormGroup key={key(group)} group={group} control={control} schema={schema} />
      ))}
    </div>
  );
}
