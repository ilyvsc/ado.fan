import { prisma } from "@/prisma/client";
import {
  serializeSong,
  serializeSongListItem,
  songListPrismaSelect,
  songPrismaSelect,
} from "@/prisma/serializer";
import type { SearchResult } from "@/types/search";
import type { Song, SongListItem } from "@/types/song";
import type { TimelinePeriod, TimelineYear } from "@/types/timeline";

/**
 * Fetch all songs for listing (lightweight, excludes lyrics content).
 *
 * Used for the lyrics search page and other listing views where full lyrics
 * are not needed. This is a security improvement to avoid exposing full
 * lyrics content when only metadata is required.
 *
 * @returns Promise resolving to an array of SongListItem (no lyrics content)
 */
export async function getAllSongsForListing(): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
    select: songListPrismaSelect,
  });
  return songs.map(serializeSongListItem);
}

/**
 * Fetch paginated songs for listing with total count.
 *
 * @param limit - Number of songs to fetch (default: 24)
 * @param offset - Number of songs to skip (default: 0)
 * @returns Promise resolving to songs array, total count, and hasMore flag
 */
export async function getPaginatedSongsForListing(
  limit = 24,
  offset = 0,
): Promise<{ songs: SongListItem[]; total: number; hasMore: boolean }> {
  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
      select: songListPrismaSelect,
      take: limit,
      skip: offset,
    }),
    prisma.song.count(),
  ]);

  return {
    songs: songs.map(serializeSongListItem),
    total,
    hasMore: offset + songs.length < total,
  };
}

/**
 * Fetch the latest songs by release date.
 *
 * @param count - Number of latest songs to fetch (default: 3)
 * @returns Promise resolving to an array of the most recent songs
 */
export async function getLatestSongs(count = 3): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    orderBy: { releaseDate: "desc" },
    select: songListPrismaSelect,
    take: count,
  });
  return songs.map(serializeSongListItem);
}

/**
 * Fetch random songs from the catalog.
 *
 * _This is a POSTGRESQL only query, ensures true random_
 *
 * @param count - Number of random songs to fetch (default: 3)
 * @returns Promise resolving to an array of random songs
 */
export async function getRandomSongs(count = 3): Promise<SongListItem[]> {
  const songs = await prisma.$queryRaw<
    any[]
  >`SELECT * FROM "Song" ORDER BY RANDOM() LIMIT ${count}`;

  return songs.map(serializeSongListItem);
}

/**
 * Fetch recommended songs (latest releases + random picks).
 *
 * @returns Promise resolving to object with latest and random song arrays
 */
export async function getRecommendedSongs(): Promise<{
  latest: SongListItem[];
  random: SongListItem[];
}> {
  const [latest, random] = await Promise.all([
    getLatestSongs(1),
    getRandomSongs(5),
  ]);

  return { latest, random };
}

/**
 * Fetch all songs from the database (includes lyrics).
 *
 * Retrieves every song record from the database, ordered by release date
 * (most recent first). Each song is transformed to match the application's
 * Song interface structure.
 *
 * @returns Promise resolving to an array of all songs in the database
 *
 * @example
 * ```typescript
 * const allSongs = await getAllSongs();
 * console.log(`Found ${allSongs.length} songs`);
 * console.log(allSongs[0].title.english); // Most recent song title
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getAllSongs(): Promise<Song[]> {
  const songs = await prisma.song.findMany({
    orderBy: { releaseDate: "desc" },
    select: songPrismaSelect,
  });
  return songs.map(serializeSong);
}

/**
 * Fetch specific songs by their IDs, preserving the given order.
 *
 * Retrieves songs from the database by their unique identifiers and returns
 * them in the exact order specified in the input array. This is useful for
 * maintaining specific ordering requirements (e.g., playlist order, featured songs).
 *
 * @param ids - Array of song IDs to fetch
 * @returns Promise resolving to an array of songs in the same order as the input IDs
 *
 * @example
 * ```typescript
 * const songIds = ['song1', 'song3', 'song2'];
 * const songs = await getSongsByIds(songIds);
 * console.log(songs.map(s => s.id)); // ['song1', 'song3', 'song2']
 * ```
 *
 * @throws {Error} If any of the requested song IDs are not found in the database
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const songs = await prisma.song.findMany({
    where: { id: { in: ids } },
    select: songPrismaSelect,
  });
  return ids
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map(serializeSong);
}

/**
 * Fetches songs belonging to a specific section.
 *
 * @example
 * ```typescript
 * const featuredSongs = await getSongsBySection('featuredSongs');
 * const timelineSongs = await getSongsBySection('timelineSongs');
 * console.log(`Featured: ${featuredSongs.length}, Timeline: ${timelineSongs.length}`);
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 *
 * @note Returns an empty array if no songs are found for the given section
 */
export async function getSongsBySection(id: string): Promise<Song[]> {
  const section = await prisma.section.findMany({
    where: { name: id },
    include: { song: { select: songPrismaSelect } },
  });

  return section.map((section) => serializeSong(section.song));
}

/** Convenience wrappers */
export const getFeaturedSongs = () => getSongsBySection("featuredSongs");
export const getTimelineSongs = () => getSongsBySection("timelineSongs");

/**
 * Fetch the timeline songs grouped by year.
 *
 * Retrieves timeline songs and organizes them into year-based groups with
 * additional categorization by release period (early/mid/late year). This
 * provides structured data for timeline visualization with detailed metadata.
 *
 * Each year group includes:
 * - All songs released in that year, sorted by release date
 * - Songs categorized by release period (early: Jan-Apr, mid: May-Aug, late: Sep-Dec)
 * - Metadata about the year's release patterns
 *
 * @returns Promise resolving to an array of TimelineYear objects, sorted by year (ascending)
 *
 * @example
 * ```typescript
 * const yearGroups = await getTimelineSongsByYear();
 * yearGroups.forEach(yearGroup => {
 *   console.log(`${yearGroup.year}: ${yearGroup.totalSongs} songs`);
 *   console.log(`  Early: ${yearGroup.categorized.early.length}`);
 *   console.log(`  Mid: ${yearGroup.categorized.mid.length}`);
 *   console.log(`  Late: ${yearGroup.categorized.late.length}`);
 * });
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 *
 * @note Period categorization: early (Jan-Apr), mid (May-Aug), late (Sep-Dec)
 * @note Years are sorted in ascending order (oldest first)
 * @note Songs within each year are sorted by release date (earliest first)
 */
export async function getTimelineSongsByYear(): Promise<TimelineYear[]> {
  const songs = await getTimelineSongs();

  const byYear = songs.reduce<Record<number, Song[]>>((groupedSongs, song) => {
    (groupedSongs[song.year] ||= []).push(song);
    return groupedSongs;
  }, {});

  return Object.entries(byYear)
    .map(([year, songs]) => {
      const sorted = songs.toSorted((a, b) =>
        a.releaseDate.localeCompare(b.releaseDate),
      );

      const periods: TimelinePeriod[] = [
        {
          period: "early" as const,
          label: `EARLY ${year}`,
          year: +year,
          songs: sorted.filter((s) => new Date(s.releaseDate).getMonth() < 4),
        },
        {
          period: "mid" as const,
          label: `MID ${year}`,
          year: +year,
          songs: sorted.filter((s) => {
            const month = new Date(s.releaseDate).getMonth();
            return month >= 4 && month < 8;
          }),
        },
        {
          period: "late" as const,
          label: `LATE ${year}`,
          year: +year,
          songs: sorted.filter((s) => new Date(s.releaseDate).getMonth() >= 8),
        },
      ].filter((p) => p.songs.length);

      return {
        year: +year,
        songs: sorted,
        totalSongs: sorted.length,
        periods,
      };
    })
    .sort((a, b) => a.year - b.year);
}

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
