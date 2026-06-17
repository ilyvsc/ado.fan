"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

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
      className="relative w-full overflow-hidden bg-ado-secondary px-6 pt-20 pb-12 md:px-12 md:pt-28 md:pb-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            <h1
              data-header-title
              className="font-serif text-7xl leading-none font-black tracking-tight text-ado-secondary-foreground uppercase md:text-9xl"
            >
              Timeline
            </h1>
            <p
              data-header-fade
              className="max-w-xl font-serif text-2xl leading-snug text-ado-secondary-foreground/90 md:text-3xl"
            >
              Rooted in Vocaloid and Utaite culture.
            </p>
            <p
              data-header-fade
              className="max-w-xl text-base leading-7 text-ado-secondary-foreground/60"
            >
              From singing alone in a closet to finding her place on stages around the
              world, each song carries something worth holding onto.
            </p>
          </div>

          <figure
            data-header-fade
            className="border-l-2 border-ado-secondary-foreground/40 pl-6 md:col-span-5"
          >
            <blockquote>
              <p className="font-serif text-lg leading-relaxed text-ado-secondary-foreground/80 italic md:text-xl">
                "So, if you could remember things today, even just a little bit, and
                take it with you as you go back, I would be really happy. If that
                happens, I think my younger self, the one who couldn't do anything,
                would be happy in this audience."
              </p>
            </blockquote>
            <figcaption className="mt-4 font-serif text-sm text-ado-secondary-foreground/50">
              Ado - SPECIAL LIVE 2024「心臓」
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
