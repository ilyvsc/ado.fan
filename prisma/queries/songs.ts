import { prisma } from "@/prisma/client";
import { songPrismaSelect, serializeSong } from "@/prisma/serializer"

import { Song, TimelineYear } from "@/types/Music";

/**
 * Fetch all songs from the database.
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
 *   console.log(`  Multiple periods: ${yearGroup.hasMultiplePeriods}`);
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

  // Group songs by year
  const byYear = songs.reduce<Record<number, Song[]>>((groupedSongs, song) => {
    if (!groupedSongs[song.year]) {
      groupedSongs[song.year] = [];
    }
    groupedSongs[song.year].push(song);
    return groupedSongs;
  }, {});

  return Object.entries(byYear)
    .map(([year, songs]) => {
      const sorted = songs.toSorted((a, b) =>
        a.releaseDate.localeCompare(b.releaseDate),
      );

      const categorized = {
        early: sorted.filter((s) => new Date(s.releaseDate).getMonth() < 4),
        mid: sorted.filter((s) => {
          const m = new Date(s.releaseDate).getMonth();
          return m >= 4 && m < 8;
        }),
        late: sorted.filter((s) => new Date(s.releaseDate).getMonth() >= 8),
      };

      const periods = Object.entries(categorized).filter(([, arr]) => arr.length);

      return {
        year: +year,
        songs: sorted,
        categorized,
        totalSongs: sorted.length,
        periods,
        hasMultiplePeriods: periods.length > 1,
      };
    })
    .sort((a, b) => a.year - b.year);
}
