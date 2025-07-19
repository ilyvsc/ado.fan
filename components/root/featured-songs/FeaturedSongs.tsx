import React from "react";

import { FeaturedSongsClient } from "@/components/root/featured-songs/FeaturedSongsClient";
import { getFeaturedSongs } from "@/constants/MusicData";

export const dynamic = "force-dynamic";

export async function FeaturedSongs() {
  try {
    const songs = await getFeaturedSongs();
    return <FeaturedSongsClient songs={songs} />;
  } catch (error) {
    return null;
  }
}
