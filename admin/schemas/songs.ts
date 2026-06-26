import { z } from "zod";

import { CreditsSchema } from "@/schemas/credits";

export const songFormSchema = z.object({
  id: z.string().min(1),
  titleEnglish: z.string().min(1),
  titleJapanese: z.string().min(1),
  length: z.string().min(1),
  description: z.string().min(1),
  releaseDate: z.string().min(1),
  nicoId: z.string().optional(),
  youtubeId: z.string().optional(),
  coverArt: z.url(),
  themeColor: z.string().optional(),
  credits: CreditsSchema.optional(),
  externalLinks: z.array(z.unknown()).optional(),
});

export type SongFormValues = z.infer<typeof songFormSchema>;
