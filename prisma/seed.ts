import { globSync, readFileSync, readdirSync } from "fs";
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
  const files = globSync(join(path, "songs/**/meta.json"));
  const songs = files.map((file) => loadJsonFile<Song>(file));

  console.log(`Loaded ${songs.length} songs.`);
  return songs;
}

function loadAlbums(path: string): AlbumDefinition[] {
  const albums = loadJsonFilesFromDir<AlbumDefinition>(join(path, "albums"));
  console.log(`Loaded ${albums.length} albums`);
  return albums;
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

  const songId = schema.songId ?? basename(dirname(dirname(path)));
  const language = schema.language ?? basename(path, ".md");

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
  const files = globSync(join(path, "songs/**/lyrics/**/*.md"));

  const lyrics = files.map((file) => {
    const songId = basename(dirname(dirname(file)));
    const lyric = parseLyricsFromMarkdown(file);

    if (lyric.songId !== songId) {
      throw new Error(
        `Lyrics songId mismatch: path=${songId}, frontmatter=${lyric.songId}`,
      );
    }

    return lyric;
  });

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

async function seedAlbums(
  albums: AlbumDefinition[],
  seededSongIds: Set<string>,
) {
  for (const album of albums) {
    const { tracks, ...data } = album;

    await prisma.album.create({
      data: {
        ...data,
        type: data.type as AlbumType,
        releaseDate: new Date(data.releaseDate),
      },
    });

    const validTracks = tracks.filter((t) => seededSongIds.has(t.songId));

    if (validTracks.length > 0) {
      await prisma.albumTrack.createMany({
        data: validTracks.map((t) => ({
          albumId: data.id,
          songId: t.songId,
          trackNumber: t.trackNumber,
        })),
      });
    }

    console.log(
      `✅ Seeded album "${data.titleEnglish}" (${validTracks.length}/${tracks.length} tracks).`,
    );
  }
}

async function seedLyrics(lyrics: Lyrics[], seededSongIds: Set<string>) {
  const validLyrics = lyrics.filter((l) => seededSongIds.has(l.songId));

  if (validLyrics.length > 0) {
    await prisma.lyrics.createMany({
      data: validLyrics.map((l) => ({
        songId: l.songId,
        language: l.language,
        translator: l.translator,
        lines: l.lines,
      })),
    });
  }

  console.log(`✅ Seeded ${validLyrics.length}/${lyrics.length} lyrics.`);
}

async function main() {
  await prisma.$connect();

  try {
    await clearDatabase();

    const path = join(import.meta.dirname, "fixtures");

    const songs = normalizeSongs(loadSongs(path));
    const seededSongIds = new Set(songs.map((s) => s.id));

    await seedSongs(songs);
    await seedAlbums(loadAlbums(path), seededSongIds);
    await seedLyrics(loadLyrics(path), seededSongIds);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
