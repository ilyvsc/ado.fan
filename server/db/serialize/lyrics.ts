import { Prisma } from "@/prisma/client";

import { lyricsPrismaSelect } from "../select/lyrics";

import type { LanguageCode } from "@/i18n/types";
import type { Lyrics } from "@/types/lyrics";

export function serializeLyrics(
  lyrics: Prisma.LyricsGetPayload<{
    select: typeof lyricsPrismaSelect;
  }>,
): Lyrics {
  return {
    songId: lyrics.songId,
    language: lyrics.language as LanguageCode,
    translator: lyrics.translator,
    lines: lyrics.lines,
  };
}
