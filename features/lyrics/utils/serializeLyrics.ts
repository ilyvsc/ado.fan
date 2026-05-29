import { getLanguageLabel } from "@/types/lyrics";

import type { LyricsLanguage, Lyrics } from "@/types/lyrics";

export function serializeLyricsToLanguages(lyrics: Lyrics[]): LyricsLanguage[] {
  return lyrics
    .filter((l) => l.lines.length > 0)
    .map((l) => ({
      code: l.language,
      label: getLanguageLabel(l.language),
      content: l.lines.join("\n"),
      lines: l.lines,
    }));
}
