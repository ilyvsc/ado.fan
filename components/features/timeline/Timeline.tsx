import { TimelineClient } from "./components/TimelineClient";

import { getTimelineSongsByYear } from "@/prisma/queries/songs";

export async function DiscographyTimeline() {
  try {
    const timelineYears = await getTimelineSongsByYear();
    return <TimelineClient timelineYears={timelineYears} />;
  } catch (error) {
    return null;
  }
}
