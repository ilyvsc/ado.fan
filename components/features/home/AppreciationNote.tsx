"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartHandshake } from "lucide-react";

import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FanAppreciation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      iconRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: iconRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      descRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-transparent py-20">
      <div className="absolute top-0 left-1/3 h-96 w-96 animate-[spin_40s_linear_infinite] rounded-full bg-ado-blue/20 blur-3xl filter" />
      <div className="absolute right-1/4 bottom-0 h-80 w-80 animate-[spin_35s_reverse_linear_infinite] rounded-full bg-ado-red/20 blur-3xl filter" />

      <div className="container mx-auto px-4 text-center">
        <div
          ref={containerRef}
          className="relative mx-auto w-fit rounded-3xl border border-white/10 bg-card/50 p-6 shadow-2xl backdrop-blur-xl md:p-12"
        >
          <div ref={iconRef} className="mb-6">
            <HeartHandshake className="mx-auto size-20 text-ado-key md:size-28" />
          </div>

          <h2
            ref={headingRef}
            className="mb-8 text-3xl font-black tracking-tighter text-foreground uppercase md:text-5xl"
          >
            A Tribute from the Heart
          </h2>

          <p
            ref={quoteRef}
            className="mx-auto mb-8 max-w-5xl text-lg leading-relaxed text-foreground/90 italic md:text-3xl"
          >
            "As a devoted fan, I created this website to express my gratitude
            for Ado's incredible music. Her powerful vocals and emotional
            delivery have been a source of inspiration and joy in my life."
          </p>

          <p
            ref={descRef}
            className="text-md mx-auto max-w-3xl text-foreground/80 md:text-xl"
          >
            Debuting in 2020 with the breakout hit{" "}
            <span className="font-semibold text-ado-key">"Usseewa"</span>, Ado's
            voice has captivated millions across the world. In 2022, she lent
            her voice to the character Uta in{" "}
            <span className="font-semibold text-ado-key">
              "One Piece Film: Red"
            </span>{" "}
            further cementing her status as a musical phenomenon.
          </p>
        </div>
      </div>
    </section>
  );
}
