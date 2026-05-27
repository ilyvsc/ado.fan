import { getTimelineSongs } from "@/prisma/queries/songs";

import { TimelineClient } from "./components/TimelineClient";

export async function DiscographyTimeline() {
  try {
    const timelineGroups = await getTimelineSongs();
    return <TimelineClient timelineGroups={timelineGroups} />;
  } catch (error) {
    return null;
  }
}
