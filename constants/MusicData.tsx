import { Prisma } from "@prisma/client";

import { Album, Song, TimelineYear } from "@/types/Music";
import { prisma } from "@/utils/lib/prisma";

const songSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  lyricsJapanese: true,
  lyricsRomaji: true,
  lyricsEnglish: true,
  length: true,
  year: true,
  releaseDate: true,
  description: true,
  nicoId: true,
  youtubeId: true,
  coverArt: true,
  themeColor: true,
};

/**
 * Transform a Prisma song object to the application's Song type.
 */
function transformSong(
  song: Prisma.SongGetPayload<{ select: typeof songSelect }>,
): Song {
  return {
    id: song.id,
    title: { english: song.titleEnglish, japanese: song.titleJapanese },
    lyrics: {
      japanese: song.lyricsJapanese,
      romaji: song.lyricsRomaji,
      english: song.lyricsEnglish,
    },
    length: song.length,
    year: song.year,
    releaseDate: song.releaseDate.toISOString().split("T")[0],
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
  };
}

/**
 * Fetch all songs from the database.
 */
export async function getAllSongs(): Promise<Song[]> {
  const songs = await prisma.song.findMany({
    orderBy: { releaseDate: "desc" },
    select: songSelect,
  });
  return songs.map(transformSong);
}

/**
 * Fetch specific songs by their IDs, preserving the given order.
 */
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const songs = await prisma.song.findMany({
    where: { id: { in: ids } },
    select: songSelect,
  });

  const songMap = new Map(songs.map((s) => [s.id, s]));
  return ids.map((id) => {
    const song = songMap.get(id);
    if (!song) throw new Error(`Song with ID "${id}" not found.`);
    return transformSong(song);
  });
}

/**
 * Fetch all albums with their tracks.
 */
export async function getAllAlbums(): Promise<Album[]> {
  const albums = await prisma.album.findMany({
    include: {
      tracks: {
        include: {
          song: { select: songSelect },
        },
        orderBy: { trackNumber: "asc" },
      },
    },
    orderBy: { releaseDate: "desc" },
  });

  return albums.map((album) => ({
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().split("T")[0],
    type: album.type,
    coverArt: album.coverArt,
    tracks: album.tracks.map((track) => ({
      song: transformSong(track.song),
      trackNumber: track.trackNumber,
      isBonusTrack: track.isBonusTrack || undefined,
    })),
  }));
}

/**
 * Fetch songs by section.
 */
export async function getSongsBySection(id: string): Promise<Song[]> {
  const sections = await prisma.section.findMany({
    where: { name: id },
    include: {
      song: { select: songSelect },
    },
  });

  if (sections.length === 0) return [];

  return sections.map(({ song }) => transformSong(song));
}

/**
 * Fetch the featured songs in defined order.
 */
export async function getFeaturedSongs(): Promise<Song[]> {
  return getSongsBySection("featuredSongs");
}

/**
 * Fetch the timeline songs in defined order.
 */
export async function getTimelineSongs(): Promise<Song[]> {
  return getSongsBySection("timelineSongs");
}

/**
 * Fetch the timeline songs grouped by year.
 */
export async function getTimelineSongsByYear(): Promise<TimelineYear[]> {
  const songs = await getTimelineSongs();

  // Group songs by year
  const songsByYear = songs.reduce(
    (acc, song) => {
      const year = song.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(song);
      return acc;
    },
    {} as Record<number, Song[]>,
  );

  // Convert to TimelineYear array with full data
  return Object.entries(songsByYear)
    .map(([year, songs]): TimelineYear => {
      const sortedSongs = songs.toSorted(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      // Categorize songs by period
      const categorized = {
        early: [] as Song[],
        mid: [] as Song[],
        late: [] as Song[],
      };
      sortedSongs.forEach((song) => {
        const month = new Date(song.releaseDate).getMonth() + 1;
        if (month <= 4) categorized.early.push(song);
        else if (month <= 8) categorized.mid.push(song);
        else categorized.late.push(song);
      });

      const periods = Object.entries(categorized).filter(
        ([_, songs]) => songs.length > 0,
      );

      return {
        year: parseInt(year),
        songs: sortedSongs,
        categorized,
        totalSongs: sortedSongs.length,
        periods,
        hasMultiplePeriods: periods.length > 1,
      };
    })
    .sort((a, b) => a.year - b.year);
}
