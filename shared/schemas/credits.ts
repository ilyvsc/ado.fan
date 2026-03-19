import { z } from "zod";

import { Prisma } from "@/prisma/generated/client";

const nonEmptyString = z.string().trim().min(1);

const CreditEntitySchema = z.object({
  name: nonEmptyString,
  romanizedName: nonEmptyString.optional(),
});

const CreditEntrySchema = z.object({
  role: nonEmptyString,
  entities: z.array(CreditEntitySchema).nonempty(),
});

export const CreditsSchema = z
  .object({ credits: z.array(CreditEntrySchema).default([]) })
  .strict();

export type Credits = z.infer<typeof CreditsSchema>;

export function assertCredits(json: unknown): Credits {
  return CreditsSchema.parse(json);
}

export function parseCredits(json: Prisma.JsonValue): Credits | null {
  if (json == null) return null;
  const result = CreditsSchema.safeParse(json);
  return result.success ? result.data : null;
}
