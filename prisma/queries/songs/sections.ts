import { prisma } from "@/prisma/client";
import { songPrismaSelect } from "@/prisma/select";
import { serializeSong } from "@/prisma/serializer";
import type { Song } from "@/types/song";
import type { TimelineGroups } from "@/types/timeline";

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
 * Retrieves timeline songs and organizes them into year-based groups.
 *
 * @returns Promise resolving to an array of TimelineGroups objects, sorted by year (ascending)
 *
 * @throws {Error} If database connection fails or query execution fails
 *
 * @note Songs within each year are sorted by release date (earliest first)
 */
export async function getTimelineSongs(): Promise<TimelineGroups[]> {
  const songs = await getSongsBySection("timelineSongs");

  const songsByYear = songs.reduce<Record<number, Song[]>>((group, song) => {
    const year = new Date(song.releaseDate).getFullYear();
    (group[year] ??= []).push(song);
    return group;
  }, {});

  return Object.entries(songsByYear)
    .map(([year, yearSongs]) => ({
      year: Number(year),
      songs: yearSongs.toSorted((a, b) =>
        a.releaseDate.localeCompare(b.releaseDate),
      ),
    }))
    .toSorted((a, b) => a.year - b.year);
}
