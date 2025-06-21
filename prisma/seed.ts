import { PrismaClient } from "@prisma/client";

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

interface Song {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  lyrics: {
    japanese: string;
    romaji: string;
    english: string;
  };
  length: string;
  year: number;
  releaseDate: string;
  description: string;
  nicoId?: string | null;
  youtubeId?: string | null;
  coverArt: string;
  themeColor?: string;
}

interface SongData {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  lyricsJapanese: string;
  lyricsRomaji: string;
  lyricsEnglish: string;
  length: number;
  year: number;
  releaseDate: string;
  description: string;
  nicoId: string;
  youtubeId: string;
  coverArt: string;
  themeColor?: string;
}

interface AlbumDefinition {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: Date;
  type: "album";
  coverArt: string;
  tracks: Array<{ songId: string; trackNumber: number }>;
}

interface SectionDefinition {
  id: string;
  items: string[];
}

const prisma = new PrismaClient();

function setupPaths() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const jsonPath = join(__dirname, "fixtures", "songs.json");
  return { __dirname, jsonPath };
}

function loadSongsFromJson(jsonPath: string): Song[] {
  try {
    const file = readFileSync(jsonPath, "utf-8");
    return JSON.parse(file);
  } catch (err) {
    console.error("Failed to load fixtures/songs.json:", err);
    process.exit(1);
  }
}

// Helper to parse time string into seconds
function parseLength(str: string): number {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

// Transform raw song data to database format
function transformSongData(songsRaw: Song[]): SongData[] {
  return songsRaw.map((s) => ({
    id: s.id,
    titleEnglish: s.title.english,
    titleJapanese: s.title?.japanese,
    lyricsJapanese: s.lyrics?.japanese,
    lyricsRomaji: s.lyrics?.romaji,
    lyricsEnglish: s.lyrics?.english,
    length: parseLength(s.length),
    year: s.year,
    releaseDate: s.releaseDate,
    description: s?.description,
    nicoId: s.nicoId ?? "",
    youtubeId: s.youtubeId ?? "",
    coverArt: s.coverArt,
    themeColor: s.themeColor,
  }));
}

function getDefaultSections(): SectionDefinition[] {
  const featuredSongIds = ["readymade", "gira-gira", "new-genesis"];
  const timelineSongIds = [
    "kimi-no-taion",
    "usseewa",
    "readymade",
    "kura-kura",
    "new-genesis",
    "rockstar",
  ];

  return [
    { id: "featuredSongs", items: featuredSongIds },
    { id: "timelineSongs", items: timelineSongIds },
  ];
}

function getAlbumDefinitions(): AlbumDefinition[] {
  return [
    {
      id: "utattemita",
      titleEnglish: "Utattemita",
      titleJapanese: "歌ってみた",
      releaseDate: new Date("2023-12-13"),
      type: "album" as const,
      coverArt:
        "https://i.scdn.co/image/ab67616d0000b273f5912abed0ea22e746552771",
      tracks: [
        { songId: "dried-flowers", trackNumber: 1 },
        { songId: "kazarijyanainoyonamidawa", trackNumber: 2 },
        { songId: "aishite", trackNumber: 3 },
        { songId: "crime-punishment", trackNumber: 4 },
        { songId: "kawaikute-gomen", trackNumber: 5 },
        { songId: "villain", trackNumber: 6 },
        { songId: "godish", trackNumber: 7 },
        { songId: "unravel", trackNumber: 8 },
        { songId: "buriki-no-dance", trackNumber: 9 },
        { songId: "dawn-fireflies", trackNumber: 10 },
      ],
    },
    {
      id: "kyougen",
      titleEnglish: "Kyōgen",
      titleJapanese: "狂言",
      releaseDate: new Date("2022-01-26"),
      type: "album" as const,
      coverArt:
        "https://i.scdn.co/image/ab67616d0000b27364381fb5ba549f149ae74560",
      tracks: [
        { songId: "readymade", trackNumber: 1 },
        { songId: "odo", trackNumber: 2 },
        { songId: "domestic-violence", trackNumber: 3 },
        { songId: "freedom", trackNumber: 4 },
        { songId: "fireworks", trackNumber: 5 },
        { songId: "aishite", trackNumber: 6 },
        { songId: "lucky-bruto", trackNumber: 7 },
        { songId: "gira-gira", trackNumber: 8 },
        { songId: "ashura-chan", trackNumber: 9 },
        { songId: "kokoro-fukakai", trackNumber: 10 },
        { songId: "usseewa", trackNumber: 11 },
        { songId: "motherland", trackNumber: 12 },
        { songId: "kagakushu", trackNumber: 13 },
        { songId: "yoru-no-pierrot", trackNumber: 14 },
      ],
    },
    {
      id: "uta-songs-one-piece-film-red",
      titleEnglish: "Uta's Songs: One Piece Film Red",
      titleJapanese: "ウタの歌 ONE PIECE FILM RED",
      releaseDate: new Date("2022-08-10"),
      type: "album" as const,
      coverArt:
        "https://i.scdn.co/image/ab67616d0000b2730cbecafa929898c82adc519c",
      tracks: [
        { songId: "new-genesis", trackNumber: 1 },
        { songId: "im-invincible", trackNumber: 2 },
        { songId: "backlight", trackNumber: 3 },
        { songId: "fleeting-lullaby", trackNumber: 4 },
        { songId: "tot-musica", trackNumber: 5 },
        { songId: "world-continuation", trackNumber: 6 },
        { songId: "where-wind-blows", trackNumber: 7 },
        { songId: "binkusuno-sake", trackNumber: 8 },
      ],
    },
  ];
}

async function seedSongs(songs: SongData[]) {
  console.log(`Seeding ${songs.length} songs…`);

  for (const s of songs) {
    await prisma.song.upsert({
      where: { id: s.id },
      update: {
        titleEnglish: s.titleEnglish,
        titleJapanese: s.titleJapanese,
        lyricsJapanese: s.lyricsJapanese,
        lyricsRomaji: s.lyricsRomaji,
        lyricsEnglish: s.lyricsEnglish,
        length: s.length.toString(),
        year: s.year,
        releaseDate: new Date(s.releaseDate),
        description: s.description,
        nicoId: s.nicoId,
        youtubeId: s.youtubeId,
        coverArt: s.coverArt,
        themeColor: s.themeColor,
      },
      create: {
        id: s.id,
        titleEnglish: s.titleEnglish,
        titleJapanese: s.titleJapanese,
        lyricsJapanese: s.lyricsJapanese,
        lyricsRomaji: s.lyricsRomaji,
        lyricsEnglish: s.lyricsEnglish,
        length: s.length.toString(),
        year: s.year,
        releaseDate: new Date(s.releaseDate),
        description: s.description,
        nicoId: s.nicoId,
        youtubeId: s.youtubeId,
        coverArt: s.coverArt,
        themeColor: s.themeColor,
      },
    });
  }

  console.log("🎉 Songs seeded!");
}

async function seedSections(sections: SectionDefinition[]) {
  for (const { id, items } of sections) {
    const section = await prisma.section.upsert({
      where: { id },
      create: { id },
      update: {},
    });

    const sectionItems = items.map((songId, idx) => ({
      sectionId: section.id,
      songId,
      order: idx + 1,
    }));

    await prisma.sectionItem.createMany({
      data: sectionItems,
      skipDuplicates: true,
    });

    console.log(`🔧 Section "${id}" has ${items.length} items.`);
  }
  console.log("✅ Sections & SectionItems seeded!");
}

async function seedAlbums(albumDefinitions: AlbumDefinition[]) {
  for (const def of albumDefinitions) {
    const album = await prisma.album.upsert({
      where: { id: def.id },
      create: {
        id: def.id,
        titleEnglish: def.titleEnglish,
        titleJapanese: def.titleJapanese,
        releaseDate: def.releaseDate,
        type: def.type,
        coverArt: def.coverArt,
      },
      update: {},
    });

    await prisma.albumTrack.createMany({
      data: def.tracks.map((t) => ({
        albumId: album.id,
        songId: t.songId,
        trackNumber: t.trackNumber,
      })),
      skipDuplicates: true,
    });

    console.log(
      `✅ Album "${def.titleEnglish}" seeded with ${def.tracks.length} tracks.`,
    );
  }
}

async function main() {
  try {
    const { jsonPath } = setupPaths();
    const songsRaw = loadSongsFromJson(jsonPath);
    const songs = transformSongData(songsRaw);
    const sections = getDefaultSections();
    const albumDefinitions = getAlbumDefinitions();

    await seedSongs(songs);
    await seedSections(sections);
    await seedAlbums(albumDefinitions);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
