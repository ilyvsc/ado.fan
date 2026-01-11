import type { Language, Lyrics } from "@/types/lyrics";
import { getLanguageLabel } from "@/types/lyrics";

export function serializeLyricsToLanguages(lyrics: Lyrics[]): Language[] {
  return lyrics
    .filter((l) => l.lines.length > 0)
    .map((l) => ({
      code: l.language,
      label: getLanguageLabel(l.language),
      content: l.lines.join("\n"),
    }));
}
