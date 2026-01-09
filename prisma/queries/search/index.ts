import { prisma } from "@/prisma/client";
import { songListPrismaSelect } from "@/prisma/serializer";
import type { SearchResult } from "@/types/search";

/**
 * Universal search for songs by title OR lyrics content.
 * Returns lightweight results with match context showing where the query matched.
 *
 * @param query - Search query string
 * @returns Promise resolving to an array of SearchResult with match context
 *
 * @example
 * ```typescript
 * const results = await searchSongsUniversal('usseewa');
 * results.forEach(r => console.log(r.matchType, r.matchContext));
 * ```
 */
export async function searchSongsUniversal(
  query: string,
): Promise<SearchResult[]> {
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
    year: song.year,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
    matchType: "title",
  }));
}
