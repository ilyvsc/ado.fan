"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Sparkle } from "lucide-react";

import { useRef } from "react";

import type { Song } from "@/types/song";

gsap.registerPlugin(ScrollTrigger);

export function SongCreditsDetails({ song }: { song: Song }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasDescription = !!song.description;
  const hasCredits = song.credits && song.credits.credits.length > 0;

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(sectionRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef },
  );

  if (!hasDescription && !hasCredits) return null;

  return (
    <section ref={sectionRef} className="relative my-5 w-full max-w-4xl p-5">
      {hasDescription && (
        <div className="relative my-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-(--theme-contrast)/15" />
            <div className="flex flex-col items-center">
              <BookOpen className="mb-2 size-4 text-(--theme-contrast)/50" />
              <h3 className="text-xs font-medium tracking-wide text-(--theme-contrast)/70 uppercase">
                About this Song
              </h3>
              <p className="mt-1 text-xs text-(--theme-contrast)/50">
                Background & Context
              </p>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-(--theme-contrast)/15" />
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap text-(--theme-contrast)/70 sm:text-base sm:leading-loose">
            {song.description}
          </p>
        </div>
      )}

      {hasCredits && (
        <div className="relative mt-4">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-(--theme-contrast)/15" />
            <div className="flex flex-col items-center">
              <Sparkle className="mb-2 size-4 text-(--theme-contrast)/50" />
              <h3 className="text-xs font-medium tracking-wide text-(--theme-contrast)/70 uppercase">
                Credits
              </h3>
              <p className="mt-1 text-xs text-(--theme-contrast)/50">
                Artists & Contributors
              </p>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-(--theme-contrast)/15" />
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {song.credits?.credits.map((credit) => (
              <div key={credit.role} className="group">
                <span className="mb-1 block text-xs font-semibold text-(--theme-contrast)/50 capitalize">
                  {credit.role}
                </span>
                <div className="space-y-px">
                  {credit.entities.map((entity) => (
                    <div key={entity.name} className="flex items-baseline gap-2">
                      <span className="text-sm text-(--theme-contrast)/85">
                        {entity.name}
                      </span>
                      {entity.romanizedName && (
                        <span className="text-xs text-(--theme-contrast)/50">
                          {entity.romanizedName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 h-px w-full bg-linear-to-r from-transparent via-(--theme-contrast)/15 to-transparent" />
    </section>
  );
}
