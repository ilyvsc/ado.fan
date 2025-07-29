import React from "react";

import { TimelineClient } from "@/components/root/timeline/TimelineClient";
import { getTimelineSongsByYear } from "@/constants/MusicData";

export const dynamic = "force-dynamic";

export async function DiscographyTimeline() {
  try {
    const timelineYears = await getTimelineSongsByYear();
    return <TimelineClient timelineYears={timelineYears} />;
  } catch (error) {
    return null;
  }
}
