"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { SongCard } from "./TimelineCard";
import { TimelineHeader } from "./TimelineHeader";

import type { TimelineGroups } from "@/types/timeline";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function TimelineClient({
  timelineGroups,
}: {
  timelineGroups: TimelineGroups[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const [activeYear, setActiveYear] = useState(timelineGroups[0]?.year ?? null);
  const [openYears, setOpenYears] = useState<Set<number>>(
    () => new Set(timelineGroups[0] ? [timelineGroups[0].year] : []),
  );

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const total = timelineGroups.length;
  const activeIndex = timelineGroups.findIndex((g) => g.year === activeYear);

  const activeYearRef = useRef(activeYear);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!section || !wrapper || !content) return;

      const sections = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll("[data-year-section]"),
      );

      const cards = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll("[data-song-card]"),
      );

      const updateActiveYear = () => {
        const wrapperCenter = wrapper.getBoundingClientRect().width / 2;

        const activeSection = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.left <= wrapperCenter && rect.right >= wrapperCenter;
        });

        if (!activeSection) return;

        const year = Number(activeSection.dataset.yearSection);
        if (!year || year === activeYearRef.current) return;

        activeYearRef.current = year;
        setActiveYear(year);
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getScrollDistance = () => content.offsetWidth - wrapper.clientWidth;

        gsap.set([content, ...sections, ...cards], {
          willChange: "transform, opacity",
        });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            id: "timeline-scroll",
            trigger: section,
            pin: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              updateActiveYear();
              if (fillRef.current) {
                gsap.set(fillRef.current, { scaleX: self.progress });
              }
              if (knobRef.current) {
                gsap.set(knobRef.current, { left: `${self.progress * 100}%` });
              }
              if (skipRef.current) {
                skipRef.current.disabled = self.progress >= 0.95;
              }
            },
          },
        });

        scrollTl.to(content, {
          x: () => -getScrollDistance(),
          ease: "none",
        });

        sections.forEach((sec) => {
          const numeral = sec.querySelector("[data-year-numeral]");
          const sectionCards = sec.querySelectorAll("[data-song-card]");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sec,
              containerAnimation: scrollTl,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });

          // enter
          tl.fromTo(
            sec,
            { autoAlpha: 0, scale: 0.92, xPercent: 8 },
            {
              autoAlpha: 1,
              scale: 1,
              xPercent: 0,
              ease: "power3.out",
              duration: 1.2,
            },
            0,
          );

          if (numeral) {
            tl.fromTo(
              numeral,
              { autoAlpha: 0, yPercent: 18, scale: 0.9 },
              {
                autoAlpha: 1,
                yPercent: 0,
                scale: 1,
                ease: "power3.out",
                duration: 1,
              },
              0.1,
            );
          }

          tl.fromTo(
            sectionCards,
            { autoAlpha: 0, y: 36, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: 0.08,
              ease: "power3.out",
              duration: 1,
            },
            0.2,
          );

          // exit
          tl.to(
            sectionCards,
            {
              autoAlpha: 0,
              y: -28,
              scale: 0.97,
              stagger: 0.05,
              ease: "power2.in",
              duration: 0.9,
            },
            2.4,
          );

          if (numeral) {
            tl.to(
              numeral,
              {
                autoAlpha: 0,
                yPercent: -18,
                scale: 0.9,
                ease: "power2.in",
                duration: 1,
              },
              2.5,
            );
          }

          tl.to(
            sec,
            {
              autoAlpha: 0,
              scale: 0.92,
              xPercent: -8,
              ease: "power2.in",
              duration: 1.2,
            },
            2.6,
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        sections.forEach((sec) => {
          const numeral = sec.querySelector("[data-year-numeral]");
          const sectionCards = sec.querySelectorAll("[data-song-card]");

          if (numeral) {
            gsap.from(numeral, {
              autoAlpha: 0,
              x: -24,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: sec, start: "top 85%" },
            });
          }

          gsap.from(sectionCards, {
            autoAlpha: 0,
            y: 24,
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: sec, start: "top 80%" },
          });
        });
      });

      return () => {
        gsap.set([content, ...sections, ...cards], { clearProps: "willChange" });
        mm.revert();
      };
    },
    { scope: wrapperRef, dependencies: [timelineGroups] },
  );

  const handleSkip = () => {
    const scrollTrigger = ScrollTrigger.getById("timeline-scroll");
    if (!scrollTrigger) return;

    gsap.to(window, {
      scrollTo: scrollTrigger.end,
      duration: 1.5,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background px-4 py-10 md:h-dvh md:overflow-hidden md:p-12"
    >
      <div className="overflow-hidden rounded-3xl bg-ado-secondary/80 md:flex md:h-full md:flex-col dark:bg-ado-secondary/40">
        <TimelineHeader />

        <div
          ref={wrapperRef}
          className={cn(
            "relative w-full border-t border-ado-secondary-foreground/10 md:flex md:min-h-0 md:flex-1 md:items-center md:overflow-hidden",
          )}
        >
          <div
            ref={contentRef}
            className="flex flex-col gap-12 px-6 py-10 md:h-full md:w-max md:flex-row md:items-center md:gap-5 md:px-20 md:py-0 md:pb-12"
          >
            {timelineGroups.map((yearData) => {
              const isActive = activeYear === yearData.year;
              const isOpen = openYears.has(yearData.year);

              return (
                <div
                  key={yearData.year}
                  data-year-section={yearData.year}
                  className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-center md:gap-4 md:px-6"
                >
                  <button
                    type="button"
                    data-year-numeral
                    onClick={() => {
                      toggleYear(yearData.year);
                    }}
                    aria-expanded={isOpen}
                    className="z-10 flex shrink-0 items-center justify-between gap-4 self-stretch text-left md:pointer-events-none md:h-full md:flex-col md:justify-center md:self-auto"
                  >
                    <span
                      className={cn(
                        "font-serif text-5xl leading-none font-black tracking-tight text-ado-secondary-foreground transition-all duration-500 ease-out md:text-9xl md:[writing-mode:vertical-rl]",
                        isActive
                          ? "md:scale-100 md:opacity-100"
                          : "md:scale-95 md:opacity-20",
                      )}
                    >
                      {yearData.year}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-ado-secondary-foreground/40 md:hidden"
                    />
                    <ChevronDown
                      className={cn(
                        "h-9 w-9 shrink-0 text-ado-secondary-foreground/70 transition-transform duration-300 md:hidden",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out md:block",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden md:overflow-visible">
                      <div className="flex flex-col gap-2 md:grid md:grid-flow-col md:grid-rows-4 md:gap-x-2">
                        {yearData.songs.map((song) => (
                          <SongCard key={song.id} song={song} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-8 bottom-6 z-20 hidden md:block xl:inset-x-16">
            <div className="mb-3 flex items-end justify-between select-none">
              <span className="font-serif text-2xl leading-none font-bold text-ado-secondary-foreground xl:text-3xl">
                {activeYear}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-ado-secondary-foreground/70">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  ref={skipRef}
                  onClick={handleSkip}
                  className="pointer-events-auto flex items-center gap-1.5 rounded-md bg-ado-primary/70 px-3 py-1.5 text-ado-primary-foreground transition-opacity duration-300 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="text-xs font-medium">Skip Timeline</span>
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="relative h-px w-full bg-ado-primary-foreground/50">
              <div
                ref={fillRef}
                className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-ado-primary"
              />
              <div
                ref={knobRef}
                className="absolute top-1/2 left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ado-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
