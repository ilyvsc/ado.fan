import { PrismaClient } from "@prisma/client";

import { Album, Song } from "@/types/Music";

const prisma = new PrismaClient();

/**
 * Fetch all songs from the database.
 */
export async function getAllSongs(): Promise<Song[]> {
  const db = await prisma.song.findMany({
    orderBy: { releaseDate: "desc" },
    select: {
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
    },
  });

  return db.map((song) => ({
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
    themeColor: song.themeColor || undefined,
  }));
}

/**
 * Fetch specific songs by their IDs, preserving the given order.
 */
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const db = await prisma.song.findMany({
    where: { id: { in: ids } },
    select: {
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
    },
  });

  return ids.map((id) => {
    const song = db.find((r) => r.id === id);
    if (!song) throw new Error(`Song with ID "${id}" not found.`);
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
      themeColor: song.themeColor || undefined,
    };
  });
}

/**
 * Fetch all albums with their tracks.
 */
export async function getAllAlbums(): Promise<Album[]> {
  const db = await prisma.album.findMany({
    include: {
      tracks: {
        include: {
          song: {
            select: {
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
            },
          },
        },
      },
    },
    orderBy: { releaseDate: "desc" },
  });

  return db.map((album) => ({
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().split("T")[0],
    type: album.type,
    coverArt: album.coverArt,
    tracks: album.tracks.map((track) => ({
      song: {
        id: track.song.id,
        title: {
          english: track.song.titleEnglish,
          japanese: track.song.titleJapanese,
        },
        length: track.song.length,
        releaseDate: track.song.releaseDate.toISOString().split("T")[0],
        description: track.song.description,
        youtubeId: track.song.youtubeId,
        nicoId: track.song.nicoId,
        coverArt: track.song.coverArt,
        lyrics: {
          japanese: track.song.lyricsJapanese,
          romaji: track.song.lyricsRomaji,
          english: track.song.lyricsEnglish,
        },
        year: track.song.year,
        themeColor: track.song.themeColor || undefined,
      },
      trackNumber: track.trackNumber,
      isBonusTrack: track.isBonusTrack || undefined,
    })),
  }));
}

export async function getSongsBySection(id: string): Promise<Song[]> {
  const section = await prisma.section.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          song: {
            select: {
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
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!section) return [];

  return section.items.map(({ song }) => ({
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
    themeColor: song.themeColor || undefined,
  }));
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
