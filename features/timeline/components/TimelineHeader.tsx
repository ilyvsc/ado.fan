"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { TracedRosesCrown } from "@/components/icons/TracedRosesCrown";

gsap.registerPlugin(ScrollTrigger);

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
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        q("[data-header-title]"),
        { clipPath: "inset(0 0 100% 0)", y: 60 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 1.1,
          ease: "power4.out",
        },
      ).from(
        q("[data-header-fade]"),
        { autoAlpha: 0, y: 28, duration: 0.8, stagger: 0.12 },
        "-=0.5",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 pt-8 pb-6 md:py-6"
    >
      <TracedRosesCrown className="pointer-events-none absolute top-2 right-4 h-28 w-28 rotate-12 text-ado-primary md:hidden" />

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-end gap-5 md:grid-cols-12">
          <div className="space-y-3 md:col-span-7">
            <h1
              data-header-title
              className="font-serif text-5xl leading-none font-black tracking-tight text-ado-secondary-foreground uppercase md:text-7xl"
            >
              Timeline
            </h1>
            <p
              data-header-fade
              className="max-w-xl font-serif text-xl leading-snug text-ado-secondary-foreground/90 md:text-2xl"
            >
              Rooted in Vocaloid and Utaite culture.
            </p>
            <p
              data-header-fade
              className="max-w-xl text-base leading-7 text-ado-secondary-foreground/70"
            >
              From singing alone in a closet to finding her place on stages around the
              world, each song carries something worth holding onto.
            </p>
          </div>

          <figure data-header-fade className="md:col-span-5 md:pt-16 md:pl-10">
            <blockquote className="border-l-2 border-ado-primary/80 pl-5">
              <p className="max-w-md font-serif text-base leading-relaxed text-ado-secondary-foreground/90 italic md:text-lg">
                "So, if you could remember things today, even just a little bit, and
                take it with you as you go back, I would be really happy. If that
                happens, I think my younger self, the one who couldn't do anything,
                would be happy in this audience."
              </p>
            </blockquote>
            <figcaption className="mt-4 pl-5 font-serif text-sm text-ado-secondary-foreground/70">
              Ado - SPECIAL LIVE 2024「心臓」
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
