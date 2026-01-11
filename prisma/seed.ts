import { existsSync, readFileSync, readdirSync } from "fs";
import { basename, dirname, join } from "path";
import matter from "gray-matter";
import { z } from "zod";

import { prisma } from "./client";
import { AlbumType, Prisma } from "./generated/client";
import { serializeSongSeed } from "./serializer";

import type { AlbumDefinition } from "@/types/album";
import type { Lyrics } from "@/types/lyrics";
import type { Song } from "@/types/song";

function loadJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function loadJsonFilesFromDir<T>(path: string): T[] {
  return readdirSync(path)
    .filter((f) => f.endsWith(".json"))
    .map((file) => loadJsonFile<T>(join(path, file)));
}

function loadSongs(path: string): Song[] {
  const songsPath = join(path, "songs");
  const songs = readdirSync(songsPath)
    .map((slug) => join(songsPath, slug, "meta.json"))
    .filter(existsSync)
    .map((file) => loadJsonFile<Song>(file));

  console.log(`Loaded ${songs.length} songs.`);
  return songs;
}

function loadAlbums(path: string): AlbumDefinition[] {
  const albums = loadJsonFilesFromDir<AlbumDefinition>(join(path, "albums"));
  console.log(`Loaded ${albums.length} albums`);
  return albums;
}

function findLyricsFiles(path: string): string[] {
  return readdirSync(path)
    .map((slug) => join(path, slug, "lyrics"))
    .filter(existsSync)
    .flatMap((lyricsDir) =>
      readdirSync(lyricsDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => join(lyricsDir, f)),
    );
}

function parseLyricsFromMarkdown(path: string): Lyrics {
  const lyricsSchema = z.object({
    songId: z.string().min(1).optional(),
    language: z.string().min(1).optional(),
    translator: z.string().optional(),
  });

  const raw = readFileSync(path, "utf-8");
  const { data, content } = matter(raw);
  const schema = lyricsSchema.parse(data);

  const songId = schema.songId || basename(dirname(dirname(path)));
  const language = schema.language || basename(path, ".md");

  const lines = content
    .trim()
    .split("\n")
    .map((line) => line.trim());

  return {
    songId,
    language,
    translator: schema.translator ?? null,
    lines,
  };
}

function loadLyrics(path: string): Lyrics[] {
  const songsPath = join(path, "songs");
  const files = findLyricsFiles(songsPath);

  const pathSongId = new Set(
    files.map((file) => basename(dirname(dirname(file)))),
  );

  const lyrics = files.map(parseLyricsFromMarkdown);

  for (const lyric of lyrics) {
    if (!pathSongId.has(lyric.songId)) {
      throw new Error(`Lyrics songId mismatch for "${lyric.songId}"`);
    }
  }

  console.log(`Loaded ${lyrics.length} lyrics.`);
  return lyrics;
}

function normalizeSongs(songs: Song[]): Prisma.SongCreateInput[] {
  return serializeSongSeed(songs).map((song) => ({
    ...song,
    description: Array.isArray(song.description)
      ? song.description
          .map((item) => (Array.isArray(item) ? item.join("\n") : item))
          .join("\n")
      : (song.description ?? ""),
  }));
}

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await prisma.$transaction([
    prisma.albumTrack.deleteMany(),
    prisma.lyrics.deleteMany(),
    prisma.song.deleteMany(),
    prisma.album.deleteMany(),
  ]);
}

async function seedSongs(songs: Prisma.SongCreateInput[]) {
  await prisma.song.createMany({ data: songs });
  console.log(`✅ Seeded ${songs.length} songs.`);
}

async function seedAlbums(albums: AlbumDefinition[]) {
  for (const album of albums) {
    const { tracks, ...data } = album;

    await prisma.album.create({
      data: {
        ...data,
        type: data.type as AlbumType,
        releaseDate: new Date(data.releaseDate),
      },
    });

    if (tracks.length > 0) {
      await prisma.albumTrack.createMany({
        data: tracks.map((t) => ({
          albumId: data.id,
          songId: t.songId,
          trackNumber: t.trackNumber,
        })),
      });
    }

    console.log(
      `✅ Seeded album "${data.titleEnglish}" (${tracks.length} tracks).`,
    );
  }
}

async function seedLyrics(lyrics: Lyrics[]) {
  await prisma.lyrics.createMany({
    data: lyrics.map((l) => ({
      songId: l.songId,
      language: l.language,
      translator: l.translator,
      lines: l.lines,
    })),
  });

  console.log(`✅ Seeded ${lyrics.length} lyrics.`);
}

async function main() {
  await prisma.$connect();

  try {
    await clearDatabase();

    const path = join(import.meta.dirname, "fixtures");

    await seedSongs(normalizeSongs(loadSongs(path)));
    await seedAlbums(loadAlbums(path));
    await seedLyrics(loadLyrics(path));

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
