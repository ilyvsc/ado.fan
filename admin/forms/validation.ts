import { type FieldValues, type Path } from "react-hook-form";

export interface ParseableSchema {
  shape?: Record<string, { isOptional?: () => boolean } | undefined>;
}

export function isFieldRequired<T extends FieldValues>(
  schema: ParseableSchema | undefined,
  name: Path<T>,
) {
  if (!schema?.shape) return false;
  return !schema.shape[name as string]?.isOptional?.();
}
