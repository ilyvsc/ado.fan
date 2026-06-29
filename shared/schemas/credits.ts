import { z } from "zod";

import { Prisma } from "@/prisma/client";

const nonEmptyString = z.string().trim().min(1);

const CreditEntitySchema = z.object({
  name: nonEmptyString,
  romanizedName: z.preprocess(
    (v) => (v === "" ? undefined : v),
    nonEmptyString.optional(),
  ),
});

const CreditEntrySchema = z.object({
  role: nonEmptyString,
  entities: z.array(CreditEntitySchema).nonempty(),
});

export const CreditsSchema = z.strictObject({
  credits: z.array(CreditEntrySchema).default([]),
});

export type Credits = z.infer<typeof CreditsSchema>;

export function assertCredits(json: unknown): Credits {
  return CreditsSchema.parse(json);
}

export function parseCredits(json: Prisma.JsonValue): Credits | null {
  if (json == null) return null;
  const result = CreditsSchema.safeParse(json);
  return result.success ? result.data : null;
}
