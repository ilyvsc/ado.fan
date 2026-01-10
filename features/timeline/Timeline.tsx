import { TimelineClient } from "./components/TimelineClient";

import { getTimelineSongs } from "@/prisma/queries/songs";

export async function DiscographyTimeline() {
  try {
    const timelineGroups = await getTimelineSongs();
    return <TimelineClient timelineGroups={timelineGroups} />;
  } catch (error) {
    return null;
  }
}
