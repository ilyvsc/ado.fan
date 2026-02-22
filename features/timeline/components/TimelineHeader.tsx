"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import Image from "next/image";
import { useRef } from "react";

export function TimelineHeader() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      tl.from(q("[data-header-line]"), {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "top",
        duration: 1.4,
      })
        .from(
          q("[data-header-title]"),
          { opacity: 0, y: 80, duration: 1.2, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          q("[data-header-fade]"),
          { opacity: 0, y: 40, duration: 1, stagger: 0.2 },
          "-=0.5",
        )
        .from(
          q("[data-header-indicator]"),
          { opacity: 0, duration: 0.6 },
          "-=0.4",
        );
      const transitionEl = q("[data-header-transition]");
      if (transitionEl.length) {
        gsap.to(transitionEl, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: transitionEl,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col bg-ado-secondary px-4 pt-20 pb-44 md:px-8 md:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl flex-1">
        <div className="flex items-start gap-6 md:gap-12">
          <div
            data-header-line
            className="mt-2 h-56 w-0.5 shrink-0 bg-ado-secondary-foreground"
          />

          <div className="flex flex-col gap-4 md:gap-6">
            <h1
              data-header-title
              className="font-gambarino text-5xl leading-6 font-black tracking-wide text-ado-secondary-foreground uppercase md:text-6xl"
            >
              Timeline
            </h1>

            <div
              data-header-fade
              className="max-w-3xl space-y-2 text-ado-secondary-foreground/80"
            >
              <p className="font-gambarino text-2xl tracking-wide md:text-3xl">
                Rooted in Vocaloid and Utaite culture
              </p>
              <p className="max-w-2xl text-sm md:text-lg">
                From singing alone in a closet to finding her place on stages
                around the world, each song carries something worth holding
                onto.
              </p>
            </div>

            <div
              data-header-fade
              className="mt-4 flex flex-col gap-8 md:mt-8 md:flex-row"
            >
              <div className="flex gap-8 md:gap-12">
                <blockquote className="max-w-xs space-y-3">
                  <p className="font-gambarino text-base leading-snug tracking-wide text-ado-secondary-foreground/90 md:text-xl">
                    "So, if you could remember things today, even just a little
                    bit, and take it with you as you go back, I would be really
                    happy. If that happens, I think my younger self, the one who
                    couldn't do anything, would be happy in this audience, so
                    please, it would make me very happy if you could remember
                    this."
                  </p>
                  <cite className="block text-xs tracking-wide text-ado-secondary-foreground/80 not-italic">
                    — Ado SPECIAL LIVE 2024「心臓」
                  </cite>
                </blockquote>
                <div className="hidden w-px bg-ado-secondary-foreground/10 md:block" />
              </div>

              <div className="grid flex-1 grid-cols-2 gap-x-2 gap-y-4">
                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-ado-secondary-foreground md:text-6xl">
                    100+
                  </div>
                  <p className="text-xs text-ado-secondary-foreground/80 md:text-sm">
                    Original songs & covers
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-ado-secondary-foreground md:text-6xl">
                    3B+
                  </div>
                  <p className="text-xs text-ado-secondary-foreground/80 md:text-sm">
                    Total streams worldwide
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-ado-secondary-foreground md:text-6xl">
                    30+
                  </div>
                  <p className="text-xs text-ado-secondary-foreground/80 md:text-sm">
                    Producer collaborations
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-ado-secondary-foreground md:text-6xl">
                    #1
                  </div>
                  <p className="text-xs text-ado-secondary-foreground/80 md:text-sm">
                    Most-streamed Japanese artist worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-header-indicator
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-20"
      >
        <Image
          src="/images/roses-crown.svg"
          alt=""
          width={40}
          height={40}
          className="h-8 w-auto opacity-40 md:h-10"
        />
        <span className="text-xs tracking-widest text-ado-secondary-foreground/80 uppercase">
          Scroll to explore
        </span>
        <div className="h-12 w-px bg-linear-to-b from-ado-secondary-foreground/40 to-transparent" />
      </div>

      <div
        data-header-transition
        className="absolute bottom-0 left-0 hidden h-1 w-full origin-left scale-x-0 bg-ado-secondary-foreground md:block"
      />
    </section>
  );
}
