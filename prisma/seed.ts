import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { AlbumType, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RawSong {
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

interface AlbumDefinition {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: Date;
  type: AlbumType;
  coverArt: string;
  tracks: Array<{ songId: string; trackNumber: number }>;
}

interface SectionDefinition {
  id: string;
  items: string[];
}
const SECTIONS = {
  FEATURED: "featuredSongs",
  TIMELINE: "timelineSongs",
};

const seedConfig = {
  sections: [
    {
      id: SECTIONS.FEATURED,
      items: ["readymade", "gira-gira", "new-genesis"],
    },
    {
      id: SECTIONS.TIMELINE,
      items: [
        "kimi-no-taion",
        "usseewa",
        "readymade",
        "kura-kura",
        "new-genesis",
        "rockstar",
      ],
    },
  ] as SectionDefinition[],
  albums: [
    {
      id: "utattemita",
      titleEnglish: "Utattemita",
      titleJapanese: "歌ってみた",
      releaseDate: new Date("2023-12-13"),
      type: AlbumType.album,
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
      type: AlbumType.album,
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
      type: AlbumType.album,
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
  ] as AlbumDefinition[],
};

function loadSongsFromJson(jsonPath: string): RawSong[] {
  try {
    const file = readFileSync(jsonPath, "utf-8");
    return JSON.parse(file);
  } catch (err) {
    console.error(`Failed to load or parse fixtures/songs.json:`, err);
    throw err;
  }
}

function transformSongData(rawSongs: RawSong[]): Prisma.SongCreateInput[] {
  return rawSongs.map((s) => ({
    id: s.id,
    titleEnglish: s.title.english,
    titleJapanese: s.title.japanese,
    lyricsJapanese: s.lyrics?.japanese || "",
    lyricsRomaji: s.lyrics?.romaji || "",
    lyricsEnglish: s.lyrics?.english || "",
    length: s.length,
    year: s.year,
    releaseDate: new Date(s.releaseDate),
    description: s.description || "",
    nicoId: s.nicoId || null,
    youtubeId: s.youtubeId || null,
    coverArt: s.coverArt,
    themeColor: s.themeColor,
  }));
}

// --- Seeding Functions ---

async function seedSongs(songs: Prisma.SongCreateInput[]) {
  console.log(`Seeding ${songs.length} songs…`);
  for (const songData of songs) {
    await prisma.song.upsert({
      where: { id: songData.id },
      update: songData,
      create: songData,
    });
  }
  console.log("✅ Songs seeded!");
}

async function seedSections(sections: SectionDefinition[]) {
  console.log(`Seeding ${sections.length} sections…`);
  for (const { id, items } of sections) {
    await prisma.section.createMany({
      data: items.map((songId) => ({
        name: id,
        songId,
      })),
      skipDuplicates: true,
    });
    console.log(`  - Section "${id}" seeded with ${items.length} items.`);
  }
  console.log("✅ Sections seeded!");
}

async function seedAlbums(albumDefinitions: AlbumDefinition[]) {
  console.log(`Seeding ${albumDefinitions.length} albums…`);
  for (const { tracks, ...albumData } of albumDefinitions) {
    await prisma.album.upsert({
      where: { id: albumData.id },
      create: albumData,
      update: albumData,
    });

    await prisma.albumTrack.deleteMany({ where: { albumId: albumData.id } });

    if (tracks.length > 0) {
      await prisma.albumTrack.createMany({
        data: tracks.map((t) => ({
          albumId: albumData.id,
          songId: t.songId,
          trackNumber: t.trackNumber,
        })),
        skipDuplicates: true,
      });
    }

    console.log(
      `  - Album "${albumData.titleEnglish}" seeded with ${tracks.length} tracks.`,
    );
  }
  console.log("✅ Albums seeded!");
}

// --- Main Execution ---

async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const jsonPath = join(__dirname, "fixtures", "songs.json");

    const rawSongs = loadSongsFromJson(jsonPath);
    const songsToCreate = transformSongData(rawSongs);

    await seedSongs(songsToCreate);
    await seedSections(seedConfig.sections);
    await seedAlbums(seedConfig.albums);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
