import { getTimelineSongs } from "@/db/queries/songs";

import { TimelineClient } from "./components/TimelineClient";

export async function DiscographyTimeline() {
  const timelineGroups = await getTimelineSongs().catch(() => null);
  if (!timelineGroups) return null;

  return <TimelineClient timelineGroups={timelineGroups} />;
}
