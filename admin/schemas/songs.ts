import { z } from "zod";

import { CreditsSchema } from "@/schemas/credits";

export const songFormSchema = z.object({
  id: z.string().min(1),
  titleEnglish: z.string().min(1),
  titleJapanese: z.string().nullish(),
  length: z.string().min(1),
  description: z.string().nullish(),
  releaseDate: z.string().min(1),
  nicoId: z.string().nullish(),
  youtubeId: z.string().nullish(),
  coverArt: z.url().or(z.literal("")).nullish(),
  themeColor: z.string().nullish(),
  credits: CreditsSchema.optional(),
  externalLinks: z.array(z.unknown()).optional(),
});

export type SongFormValues = z.infer<typeof songFormSchema>;
