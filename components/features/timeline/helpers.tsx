import { TimelinePeriod, TimelineYear } from "@/types/Music";

export function timelineStepsDesktop(
  timelineYears: readonly TimelineYear[],
  items: number = 3,
): TimelinePeriod[] {
  const steps: TimelinePeriod[] = [];

  for (const { year, periods } of timelineYears) {
    for (let pIndex = 0; pIndex < periods.length; pIndex++) {
      const { period, label, songs } = periods[pIndex];

      for (let i = 0; i < songs.length; i += items) {
        steps.push({
          year,
          period,
          label,
          songs: songs.slice(i, i + items),
          periodIndex: pIndex * 10 + Math.floor(i / items),
        });
      }
    }
  }

  return steps;
}

export function timelineStepsMobile(
  timelineYears: readonly TimelineYear[],
): TimelinePeriod[] {
  const steps: TimelinePeriod[] = [];

  for (const { year, periods } of timelineYears) {
    for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
      const { period, label, songs } = periods[periodIndex];

      for (let songIndex = 0; songIndex < songs.length; songIndex++) {
        steps.push({
          year,
          period,
          label,
          songs: [songs[songIndex]],
          periodIndex,
          songIndex,
        });
      }
    }
  }

  return steps;
}
