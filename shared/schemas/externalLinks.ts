import { z } from "zod";

import { Prisma } from "@/prisma/client";

const nonEmptyString = z.string().trim().min(1);

const ExternalLinkSchema = z.object({
  type: z.enum(["youtubeVideo", "nicoVideo", "link", "embed"]),
  value: nonEmptyString,
  title: nonEmptyString.nullable().optional(),
  description: nonEmptyString.nullable().optional(),
});

const ExternalLinksSchema = z.array(ExternalLinkSchema).default([]);

export type ExternalLinks = z.infer<typeof ExternalLinksSchema>;

export function parseExternalLinks(json: Prisma.JsonValue): ExternalLinks {
  if (json == null) return [];
  const result = ExternalLinksSchema.safeParse(json);
  return result.success ? result.data : [];
}
