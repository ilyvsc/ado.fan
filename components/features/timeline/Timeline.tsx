import React from "react";

import { TimelineClient } from "./components/TimelineClient";

import { getTimelineSongsByYear } from "@/prisma/queries/songs";

export const dynamic = "force-dynamic";

export async function DiscographyTimeline() {
  try {
    const timelineYears = await getTimelineSongsByYear();
    return <TimelineClient timelineYears={timelineYears} />;
  } catch (error) {
    return null;
  }
}
