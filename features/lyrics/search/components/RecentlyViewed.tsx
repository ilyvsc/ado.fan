import { HorizontalSongScroller } from "@/features/lyrics/search/components/HorizontalSongScroller";
import type { SongListItem } from "@/types/song";

export function RecentlyViewed({ songs }: { songs: SongListItem[] }) {
  return <HorizontalSongScroller title="Recently Viewed" songs={songs} />;
}
