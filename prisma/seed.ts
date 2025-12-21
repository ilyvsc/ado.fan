import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { prisma } from "./client";
import { AlbumType, Prisma } from "./generated/client";
import { serializeSongInput } from "./serializer";

import { AlbumDefinition, SectionDefinition, Song } from "@/types/Music";

const seedConfig: { sections: SectionDefinition[] } = {
  sections: [
    {
      id: "featuredSongs",
      items: ["readymade", "gira-gira", "new-genesis"],
    },
    {
      id: "timelineSongs",
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
  ],
};

function loadJsonFromFile<T>(jsonPath: string): T {
  return JSON.parse(readFileSync(jsonPath, "utf-8"));
}

function loadAllSongsFromFixtures(path: string): Song[] {
  const songsPath = join(path, "songs");
  const files = readdirSync(songsPath).filter((f) => f.endsWith(".json"));

  const allSongs: Song[] = [];
  for (const f of files) {
    const fileSongs = loadJsonFromFile<Song[]>(join(songsPath, f));
    allSongs.push(...fileSongs);
    console.log(`- Songs from "${f}" loaded.`);
  }

  console.log(`Total of ${allSongs.length} songs loaded.`);

  return allSongs;
}

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await prisma.albumTrack.deleteMany();
  await prisma.section.deleteMany();
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
}

async function seedSongs(songs: Prisma.SongCreateInput[]) {
  console.log(`Seeding ${songs.length} songs…`);

  const normalized = songs.map((song) => ({
    ...song,
    description: Array.isArray(song.description)
    ? song.description
        .map(item => Array.isArray(item) ? item.join("\n") : item)
        .join("\n")
    : (song.description ?? ""),
  }));

  await Promise.all(
    normalized.map((song) =>
      prisma.song.upsert({
        where: { id: song.id },
        update: song,
        create: song,
      }),
    ),
  );

  console.log("✅ Songs seeded!");
}

async function seedAlbums(albumDefinitions: AlbumDefinition[]) {
  console.log(`Seeding ${albumDefinitions.length} albums…`);

  for (const { tracks, ...albumData } of albumDefinitions) {
    const album = {
      ...albumData,
      type: albumData.type as AlbumType,
      releaseDate: new Date(albumData.releaseDate),
    };

    await prisma.album.upsert({
      where: { id: album.id },
      create: album,
      update: album,
    });

    await prisma.albumTrack.deleteMany({ where: { albumId: album.id } });

    if (tracks.length > 0) {
      await prisma.albumTrack.createMany({
        data: tracks.map((t) => ({
          albumId: album.id,
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

async function seedSections(sections: SectionDefinition[]) {
  console.log(`Seeding ${sections.length} sections…`);

  for (const section of sections) {
    await prisma.section.createMany({
      data: section.items.map((songId) => ({
        name: section.id,
        songId,
      })),
      skipDuplicates: true,
    });
  }
  console.log("✅ Sections seeded!");
}

async function main() {
  try {
    await prisma.$connect();
    await clearDatabase();

    const path = join(import.meta.dirname, "fixtures");
    const rawSongs = loadAllSongsFromFixtures(path);
    const rawAlbums = loadJsonFromFile(join(path, "albums.json"));

    await seedSongs(serializeSongInput(rawSongs));
    await seedAlbums(rawAlbums as AlbumDefinition[]);
    await seedSections(seedConfig.sections);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
