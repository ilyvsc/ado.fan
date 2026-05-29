import { prisma } from "@/prisma/client";
import { songListPrismaSelect } from "@/prisma/select";

import type { SearchResult } from "@/types/search";

/**
 * Search for songs by title (English or Japanese).
 * Returns lightweight results without lyrics content.
 *
 * @param query - Search query string
 * @returns Promise resolving to an array of SearchResult
 *
 * @example
 * ```typescript
 * const results = await searchSongsByTitle('usseewa');
 * results.forEach(r => console.log(r.title.english));
 * ```
 *
 * @note This search only matches against song titles, not lyrics content
 */
export async function searchSongsByTitle(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const songs = await prisma.song.findMany({
    where: {
      OR: [
        { titleEnglish: { contains: q, mode: "insensitive" } },
        { titleJapanese: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
    select: songListPrismaSelect,
  });

  return songs.map((song) => ({
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    length: song.length,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
    matchType: "title",
  }));
}
