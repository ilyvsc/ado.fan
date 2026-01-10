import { prisma } from "@/prisma/client";
import { songPrismaSelect } from "@/prisma/select";
import { serializeSong } from "@/prisma/serializer";
import type { Song } from "@/types/song";
import type { TimelinePeriod, TimelineYear } from "@/types/timeline";

/**
 * Fetches songs belonging to a specific section.
 *
 * @example
 * ```typescript
 * const timelineSongs = await getSongsBySection('timelineSongs');
 * console.log(`Timeline: ${timelineSongs.length}`);
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 *
 * @note Returns an empty array if no songs are found for the given section
 * @note Lyrics and AlbumTrack fields will be empty strings in the returned Song objects
 */
export async function getSongsBySection(id: string): Promise<Song[]> {
  const section = await prisma.section.findMany({
    where: { name: id },
    include: { song: { select: songPrismaSelect } },
  });

  return section.map((section) => serializeSong(section.song));
}

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

export const getTimelineSongs = () => getSongsBySection("timelineSongs");
