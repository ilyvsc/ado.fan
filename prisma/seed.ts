import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { prisma } from "./client";
import { AlbumType, Prisma } from "./generated/client";

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

interface AlbumDefinition {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  type: string;
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
        // 2017
        "kimi-no-taion",
        "star-night-show",
        "strangers",
        "shinkonsui",
        // 2018
        "watashino-aru",
        "kirai-kirai",
        "uminaoshi",
        "renai-saiban",
        "akushidento-coordinator",
        "merutirando-nightmare",
        "adishonaru-memory",
        "ego-rock-short",
        // 2019
        "otome-kaibou",
        "secret-answer",
        "nounai-kakumei-girl",
        "jama",
        "hungry-nicole",
        "bin",
        "basket-worm",
        // 2020
        "last-resort",
        "bokkaderaberita",
        "baka",
        "hanshoku-no-kansho",
        "sunny-wave",
        "usseewa",
        // 2021
        "gira-gira",
        "kimi-no-taion-2021",
        "daze",
        "odo",
        "aitakute",
        "yokubari",
        "adam-to-eve",
        "readymade",
        "snow-song-show",
        // 2022
        "new-genesis",
        "fireworks",
        "lucky-bruto",
        "tokyo-wa-yoru",
        "godish",
        "buriki-no-dance",
        "domestic-violence",
        // 2023
        "atashi-wa-mondaisaku",
        "ibara",
        "himawari",
        "dignity",
        "kura-kura",
        "interviewer",
        "show",
        // 2024
        "value",
        "mirror",
        "rule",
        "chocolat-cadabra",
        "sakura-biyori-time-machine",
        "shoka",
        "episode-x",
        // 2025
        "elf",
        "bouquet-for-me",
        "rockstar",
        "cats-eye",
      ],
    },
  ] as SectionDefinition[],
};

/**
 * Transform an array of Song objects to Prisma.SongCreateInput objects for database seeding.
 *
 * Converts the nested application Song structure to the flat database structure
 * required by Prisma for creating records.
 *
 * @param songs - Array of Song objects from fixture files
 * @returns Array of Prisma.SongCreateInput objects ready for database insertion
 */
export function serializeSongInput(songs: Song[]): Prisma.SongCreateInput[] {
  return songs.map((s) => ({
    id: s.id,
    titleEnglish: s.title.english,
    titleJapanese: s.title.japanese,
    lyricsJapanese: s.lyrics?.japanese ?? "",
    lyricsRomaji: s.lyrics?.romaji ?? "",
    lyricsEnglish: s.lyrics?.english ?? "",
    length: s.length,
    year: s.year,
    releaseDate: new Date(s.releaseDate),
    description: s.description ?? "",
    nicoId: s.nicoId ?? null,
    youtubeId: s.youtubeId ?? null,
    coverArt: s.coverArt,
    themeColor: s.themeColor,
  }));
}

function loadJsonFromFile<T>(jsonPath: string): T {
  try {
    return JSON.parse(readFileSync(jsonPath, "utf-8"));
  } catch (err) {
    console.error(`Failed to load or parse ${jsonPath}:`, err);
    throw err;
  }
}

function loadAllSongsFromFixtures(fixturesDir: string): Song[] {
  const allSongs: Song[] = [];
  const songsDir = join(fixturesDir, "songs");

  try {
    const files = readdirSync(songsDir);
    const songJsonFiles = files.filter((file) => file.endsWith(".json"));

    console.log(
      `📁 Found ${songJsonFiles.length} song JSON files in songs directory:`,
      songJsonFiles,
    );

    for (const filename of songJsonFiles) {
      try {
        const songs = loadJsonFromFile<Song[]>(join(songsDir, filename));
        allSongs.push(...songs);
        console.log(`✅ Loaded ${songs.length} songs from songs/${filename}`);
      } catch (err) {
        console.error(`⚠️  Failed to load songs/${filename}:`, err);
      }
    }
  } catch (err) {
    console.error(`❌ Failed to read songs directory ${songsDir}:`, err);
    throw err;
  }
  return allSongs;
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
    const albumDataForPrisma = {
      ...albumData,
      releaseDate: new Date(albumData.releaseDate),
      type: albumData.type as AlbumType,
    };

    await prisma.album.upsert({
      where: { id: albumData.id },
      create: albumDataForPrisma,
      update: albumDataForPrisma,
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
      `- Album "${albumData.titleEnglish}" seeded with ${tracks.length} tracks.`,
    );
  }
  console.log("✅ Albums seeded!");
}

// --- Main Execution ---

async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fixturesDir = join(__dirname, "fixtures");

    console.log("🔄 Loading songs from all fixture files...");
    const rawSongs = loadAllSongsFromFixtures(fixturesDir);

    console.log("🔄 Loading albums from fixtures...");
    const albums = loadJsonFromFile<AlbumDefinition[]>(
      join(fixturesDir, "albums.json"),
    );

    console.log(`📦 Total songs loaded: ${rawSongs.length}`);
    console.log(`📦 Total albums loaded: ${albums.length}`);
    const songsToCreate = serializeSongInput(rawSongs);

    await seedSongs(songsToCreate);
    await seedSections(seedConfig.sections);
    await seedAlbums(albums);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
