import { LyricsPageClient } from "@/features/lyrics/search/page";
import { getRecommendedSongs } from "@/prisma/queries/songs";

export default async function LyricsPage() {
  const recommended = await getRecommendedSongs();

  return <LyricsPageClient recommended={recommended} />;
}
