"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { RosesCrown } from "@/components/icons/RosesCrown";
import { getAssetUrl, Image } from "@/components/ui/image";

gsap.registerPlugin(ScrollTrigger);

const note =
  "This site exists because Ado's music means something real to me. Her voice has carried me through ordinary days and made them feel enormous. Every page here is a small way of saying thank you.";

export function FanAppreciation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll("[data-word]"),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        "[data-note-detail]",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 40%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        "[data-note-image]",
        { y: -40 },
        {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-28 md:py-40"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 md:px-10 lg:grid-cols-3 lg:gap-20">
        <div className="flex flex-col justify-between gap-14 lg:col-span-2">
          <p className="font-serif text-3xl leading-snug text-foreground sm:text-4xl md:text-5xl">
            {note.split(" ").map((word, i) => (
              <span key={`${i}-${word}`} data-word>
                {word}{" "}
              </span>
            ))}
          </p>

          <div className="flex flex-col gap-10">
            <p
              data-note-detail
              className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Nothing here is official and nothing is for sale. It's one fan's
              thank-you letter, built page by page, kept up to date as her story keeps
              growing.
            </p>

            <div data-note-detail className="flex items-center gap-4">
              <RosesCrown className="h-10 w-auto text-ado-primary md:h-12" />
              <span className="text-base text-muted-foreground md:text-lg">
                From a fan, with gratitude.
              </span>
            </div>
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden lg:aspect-auto lg:h-full">
          <div data-note-image className="absolute inset-0 scale-110">
            <Image
              src={getAssetUrl("tours/wish/gallery/wish-tour-paris-2024")}
              alt="Ado performing for the crowd during the Wish world tour in Paris"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
