import type { Metadata } from "next";

import { LyricsPageClient } from "@/features/lyrics/search/page";
import {
  getPaginatedSongsForListing,
  getRecommendedSongs,
} from "@/prisma/queries/songs";

export const metadata: Metadata = {
  title: "Lyrics",
  description:
    "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized lyrics side by side.",
  openGraph: {
    title: "Ado Song Lyrics — ado.fan",
    description:
      "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized lyrics side by side.",
    url: "https://ado.fan/lyrics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ado Song Lyrics — ado.fan",
    description:
      "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized lyrics side by side.",
  },
};

export default async function LyricsPage() {
  const [recommended, initialSongs] = await Promise.all([
    getRecommendedSongs(),
    getPaginatedSongsForListing(12, 0),
  ]);

  return (
    <LyricsPageClient recommended={recommended} initialSongs={initialSongs} />
  );
}
