import { LyricsPageClient } from "@/features/lyrics/search/page";
import {
  getPaginatedSongsForListing,
  getRecommendedSongs,
} from "@/prisma/queries/songs";

export default async function LyricsPage() {
  const [recommended, initialSongs] = await Promise.all([
    getRecommendedSongs(),
    getPaginatedSongsForListing(12, 0),
  ]);

  return (
    <LyricsPageClient recommended={recommended} initialSongs={initialSongs} />
  );
}
