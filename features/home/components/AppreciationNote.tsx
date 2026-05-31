"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { useRef } from "react";

import rosesCrownSVG from "@/public/images/roses-crown.svg";
import { RosesCrown } from "@/shared/components/icons/RosesCrown";

gsap.registerPlugin(ScrollTrigger);

export function FanAppreciation() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const text = textRef.current;
      if (!section || !title || !text) return;

      gsap.set(title, {
        autoAlpha: 0,
        y: 20,
        skewY: 3,
        transformOrigin: "0% 100%",
      });
      gsap.set(text, { autoAlpha: 0, y: 18, skewY: 2 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 35%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(title, { autoAlpha: 1, y: 0, skewY: 0, duration: 0.55 })
        .to(
          title,
          { letterSpacing: "0.03em", duration: 0.18, ease: "power1.out" },
          "-=0.15",
        )
        .to(
          title,
          { letterSpacing: "0em", duration: 0.24, ease: "power1.in" },
          "-=0.02",
        )
        .to(text, { autoAlpha: 1, y: 0, skewY: 0, duration: 0.5 }, "-=0.18");

      gsap.to(text, {
        y: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ado-secondary/15 py-20"
    >
      <div className="relative mx-auto px-4 text-center">
        <RosesCrown className="mx-auto mb-6 h-20 w-auto text-ado-secondary md:h-32" />

        <h2
          ref={titleRef}
          className="mb-8 text-4xl font-black tracking-tight text-balance text-foreground uppercase md:text-5xl"
        >
          A Tribute from the Heart
        </h2>

        <p
          ref={textRef}
          className="mx-auto mb-8 font-serif text-xl leading-relaxed text-balance text-foreground italic sm:text-wrap md:text-3xl lg:max-w-4xl"
        >
          "As a devoted fan, I created this website to express my gratitude for
          Ado&apos;s incredible music. Her powerful vocals and emotional delivery have
          been a source of inspiration and joy in my life."
        </p>
      </div>
    </section>
  );
}
