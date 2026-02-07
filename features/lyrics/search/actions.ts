"use server";

import { getRandomSongs } from "@/prisma/queries/songs";

export async function getRandomSongId(): Promise<string | null> {
  const [randomSong] = await getRandomSongs(1);
  return randomSong?.id ?? null;
}
