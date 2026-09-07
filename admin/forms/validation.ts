import {
  type FieldValues,
  type Path,
  type Resolver,
  type ResolverOptions,
} from "react-hook-form";

export type ParseableSchema = Record<string, { isOptional?: () => boolean } | undefined>;

export function isFieldRequired<T extends FieldValues>(
  schema: ParseableSchema | undefined,
  name: Path<T>,
) {
  if (!schema) return false;
  return !schema[name as string]?.isOptional?.();
}

export function toFieldValuesResolver<T extends FieldValues>(
  resolver: Resolver<T>,
): Resolver {
  return (values, context, options) =>
    resolver(values as T, context, options as ResolverOptions<T>);
}

export function isNumericFilterValue(value: unknown): value is number {
  return Number.isFinite(value);
}
