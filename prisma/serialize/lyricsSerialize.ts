import { Prisma } from "../generated/client";
import { lyricsPrismaSelect } from "../select";

import type { LanguageCode } from "@/shared/i18n/types";
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
