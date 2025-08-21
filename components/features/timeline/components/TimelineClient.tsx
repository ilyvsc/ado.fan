"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { timelineStepsDesktop, timelineStepsMobile } from "../helpers";
import { TimelineItem } from "./TimelineItem";
import { TimelineNavigation } from "./TimelineNavigation";

import { useIsMobile } from "@/components/ui/use-mobile";
import { TimelineYear } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

export function TimelineClient({
  timelineYears,
}: {
  readonly timelineYears: readonly TimelineYear[];
}) {
  const isMobile = useIsMobile();

  const timelineSteps = useMemo(
    () =>
      isMobile
        ? timelineStepsMobile(timelineYears)
        : timelineStepsDesktop(timelineYears),
    [timelineYears, isMobile],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToStep = useCallback((stepIndex: number) => {
    const section = sectionsRef.current[stepIndex];
    if (section) {
      setCurrentIndex(stepIndex);
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, []);

  const handlePeriodScroll = useCallback(() => {
    if (!mainRef.current) return;

    const container = mainRef.current;
    const offset = isMobile ? container.scrollLeft : container.scrollTop;
    const size = isMobile
      ? container.clientWidth
      : (sectionsRef.current[0]?.getBoundingClientRect().height ?? 1);

    const idx = Math.floor(offset / size);
    const length = Math.min(idx, timelineSteps.length - 1);
    const newIndex = Math.max(0, length);

    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  }, [isMobile, timelineSteps.length, currentIndex]);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    container.addEventListener("scroll", handlePeriodScroll, { passive: true });
    return () => container.removeEventListener("scroll", handlePeriodScroll);
  }, [handlePeriodScroll]);

  useGSAP(() => {
    if (!sectionsRef.current.length) return;

    const horizontal = isMobile;
    const triggers: ScrollTrigger[] = [];

    sectionsRef.current.forEach((section) => {
      if (!section) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: horizontal ? "left center" : "top center",
        end: horizontal ? "right center" : "bottom center",
        horizontal,
      });

      triggers.push(trigger);
    });

    ScrollTrigger.batch(cardsRef.current, {
      interval: 0.1,
      batchMax: 6,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { autoAlpha: 0, y: 20, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.05,
          },
        ),
      once: true,
    });
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isMobile, timelineSteps.length]);

  return (
    <section
      className="relative bg-gradient-to-br from-ado-secondary/40 via-background/80 to-ado-secondary/40"
      aria-label={`Music timeline with ${timelineSteps.length} steps from ${timelineYears.length} years`}
    >
      <TimelineNavigation
        timelineYears={timelineYears}
        timelineSteps={timelineSteps}
        currentIndex={currentIndex}
        onYearClick={scrollToStep}
      />

      <main
        ref={mainRef}
        className={`w-full scroll-smooth ${
          isMobile ? "overflow-x-auto" : "overflow-y-auto"
        }`}
        style={{
          scrollSnapType: isMobile ? "x mandatory" : "y mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label={
          timelineSteps[currentIndex]
            ? `Currently viewing ${timelineSteps[currentIndex].period} ${timelineSteps[currentIndex].year}`
            : "Timeline content"
        }
      >
        <div
          className={`relative m-12 ${isMobile ? "flex h-full" : "h-screen lg:h-[28rem]"}`}
        >
          {timelineSteps.map((step, index) => (
            <section
              key={`${step.year}-${step.period}-${step.periodIndex}-${index}`}
              ref={(el) => {
                if (el) sectionsRef.current[index] = el;
              }}
              className={`relative snap-start pt-20 md:pt-6 ${
                isMobile ? "w-screen shrink-0" : "h-screen lg:h-[36rem]"
              }`}
              aria-label={`${step.period} ${step.year} (Step ${index + 1}): ${step.songs.length} song${step.songs.length > 1 ? "s" : ""}`}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              <div
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="flex items-center justify-center md:pt-20"
              >
                <TimelineItem
                  timelineYear={{
                    year: step.year,
                    songs: step.songs,
                    totalSongs: step.songs.length,
                    periods: [step],
                  }}
                />
              </div>
            </section>
          ))}
        </div>
      </main>
    </section>
  );
}
