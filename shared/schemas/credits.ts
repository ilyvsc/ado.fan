import { z } from "zod";

import { Prisma } from "@/prisma/generated/client";

const creditArray = z.array(z.string().trim().min(1)).nonempty();
const credit = creditArray.optional();

export const SongCreditsSchema = z
  .object({
    vocalist: credit,
    producer: credit,
    composer: credit,
    lyricist: credit,
    arranger: credit,
    recordingEngineer: credit,
    mixingEngineer: credit,
    masteringEngineer: credit,
    illustrator: credit,
    videoDirector: credit,
    videoAnimator: credit,
  })
  .strict();

export const AlbumCreditsSchema = z
  .object({
    mainArtist: credit,
    producer: credit,
    executiveProducer: credit,
    composer: credit,
    lyricist: credit,
    arranger: credit,
    mixingEngineer: credit,
    masteringEngineer: credit,
    artDirector: credit,
    illustrator: credit,
    photographer: credit,
    designer: credit,
    label: credit,
  })
  .strict();

export type SongCredits = z.infer<typeof SongCreditsSchema>;
export type AlbumCredits = z.infer<typeof AlbumCreditsSchema>;

export function assertSongCredits(json: unknown): SongCredits {
  return SongCreditsSchema.parse(json);
}

export function assertAlbumCredits(json: unknown): AlbumCredits {
  return AlbumCreditsSchema.parse(json);
}

function parseCredits<T>(
  schema: z.ZodType<T>,
  json: Prisma.JsonValue,
): T | null {
  if (json == null) return null;

  const result = schema.safeParse(json);
  return result.success ? result.data : null;
}

export const parseSongCredits = (json: Prisma.JsonValue) =>
  parseCredits(SongCreditsSchema, json);

export const parseAlbumCredits = (json: Prisma.JsonValue) =>
  parseCredits(AlbumCreditsSchema, json);
