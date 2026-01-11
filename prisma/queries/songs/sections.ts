import { prisma } from "@/prisma/client";
import { songPrismaSelect } from "@/prisma/select";
import { serializeSong } from "@/prisma/serializer";
import { timelineConfig } from "@/shared/lib/timelineConfig";
import type { Song } from "@/types/song";
import type { TimelineGroups } from "@/types/timeline";

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
  const songs = await prisma.song.findMany({
    where: {
      id: { in: timelineConfig },
    },
    select: songPrismaSelect,
    orderBy: {
      releaseDate: "asc",
    },
  });

  const grouped: Record<number, Song[]> = {};

  for (const rawSong of songs) {
    const song = serializeSong(rawSong);
    const year = new Date(song.releaseDate).getFullYear();

    (grouped[year] ??= []).push(song);
  }

  return Object.entries(grouped).map(([year, songs]) => ({
    year: Number(year),
    songs,
  }));
}
