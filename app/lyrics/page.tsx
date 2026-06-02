import { Suspense } from "react";

import { LyricsPageClient } from "@/features/lyrics/search/page";
import { getAllSongsForListing, getRecommendedSongs } from "@/prisma/queries/songs";
import { buildAlternates, buildUrl } from "@/shared/lib/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ado Song Lyrics - Browse All Songs",
  description:
    "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized (romaji) lyrics side by side.",
  alternates: buildAlternates("/lyrics"),
  openGraph: {
    title: "Ado Song Lyrics - Browse All Songs",
    description:
      "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized (romaji) lyrics side by side.",
    url: buildUrl("/lyrics"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ado Song Lyrics - Browse All Songs",
    description:
      "Browse and search lyrics for all Ado songs. Read Japanese, English, and romanized (romaji) lyrics side by side.",
  },
};

export default async function LyricsPage() {
  const [recommended, allSongs] = await Promise.all([
    getRecommendedSongs(),
    getAllSongsForListing(),
  ]);

  return (
    <Suspense>
      <LyricsPageClient recommended={recommended} allSongs={allSongs} />
    </Suspense>
  );
}
