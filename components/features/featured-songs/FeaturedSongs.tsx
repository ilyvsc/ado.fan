import React from "react";

import { FeaturedSongsClient } from "./FeaturedSongsClient";

import { getFeaturedSongs } from "@/prisma/queries/songs";

export const dynamic = "force-dynamic";

export async function FeaturedSongs() {
  try {
    const songs = await getFeaturedSongs();
    return <FeaturedSongsClient songs={songs} />;
  } catch (error) {
    return null;
  }
}
