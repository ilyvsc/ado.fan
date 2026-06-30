import { z } from "zod";

import { CreditsSchema } from "@/schemas/credits";

export const albumFormSchema = z.object({
  id: z.string().min(1),
  titleEnglish: z.string().min(1),
  titleJapanese: z.string().nullish(),
  releaseDate: z.string().min(1),
  type: z.enum(["single", "ep", "album"]),
  coverArt: z.url().or(z.literal("")).nullish(),
  credits: CreditsSchema.optional(),
  externalLinks: z.array(z.unknown()).optional(),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
