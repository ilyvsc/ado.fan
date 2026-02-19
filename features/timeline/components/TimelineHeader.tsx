"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function TimelineHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(
        [
          lineRef.current,
          titleRef.current,
          introRef.current,
          statsRef.current,
          indicatorRef.current,
        ],
        { opacity: 0 },
      );
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });
      gsap.set(titleRef.current, { y: 80 });
      gsap.set([introRef.current, statsRef.current], { y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      tl.to(lineRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 1.4,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .to(
          [introRef.current, statsRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
          },
          "-=0.5",
        )
        .to(
          indicatorRef.current,
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4",
        )
        .to(
          indicatorRef.current,
          {
            y: 12,
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "power1.inOut",
          },
          "-=0.2",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: transitionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        })
        .to(transitionRef.current, {
          scaleX: 1,
          ease: "none",
        });

      const mm = gsap.matchMedia();
      const elements = [titleRef.current, introRef.current, statsRef.current];

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 60%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(elements, {
              opacity: 1 - progress,
              y: -50 * progress,
            });
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "60% top",
          end: "bottom 30%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(elements, {
              opacity: 1 - progress,
              y: -30 * progress,
            });
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col bg-background px-4 pt-20 pb-44 md:px-8 md:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl flex-1">
        <div className="flex items-start gap-6 md:gap-12">
          <div
            ref={lineRef}
            className="mt-2 h-56 w-0.5 shrink-0 bg-foreground"
          />

          <div className="flex flex-col gap-4 md:gap-6">
            <h1
              ref={titleRef}
              className="font-gambarino text-7xl font-black tracking-wide text-foreground uppercase md:text-8xl"
            >
              Timeline
            </h1>

            <div
              ref={introRef}
              className="max-w-3xl space-y-2 text-foreground/90"
            >
              <p className="font-gambarino text-3xl tracking-wide md:text-4xl">
                Rooted in Vocaloid and Utaite culture
              </p>
              <p className="max-w-2xl text-sm md:text-lg">
                From singing alone in a closet to finding her place on stages
                around the world, each song carries something worth holding
                onto.
              </p>
            </div>

            <div
              ref={statsRef}
              className="mt-4 flex flex-col gap-8 md:mt-8 md:flex-row"
            >
              <div className="flex gap-8 md:gap-12">
                <blockquote className="max-w-xs space-y-3">
                  <p className="font-gambarino text-base leading-snug tracking-wide text-foreground md:text-xl">
                    "So, if you could remember things today, even just a little
                    bit, and take it with you as you go back, I would be really
                    happy. If that happens, I think my younger self, the one who
                    couldn't do anything, would be happy in this audience, so
                    please, it would make me very happy if you could remember
                    this."
                  </p>
                  <cite className="block text-xs tracking-wide text-muted-foreground not-italic">
                    — Ado SPECIAL LIVE 2024「心臓」
                  </cite>
                </blockquote>
                <div className="hidden w-px bg-foreground/20 md:block" />
              </div>

              <div className="grid flex-1 grid-cols-2 gap-x-2 gap-y-4">
                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-foreground md:text-6xl">
                    100+
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Original songs & covers
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-foreground md:text-6xl">
                    3B+
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Total streams worldwide
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-foreground md:text-6xl">
                    30+
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Producer collaborations
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-gambarino text-5xl leading-none font-black text-foreground md:text-6xl">
                    #1
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Most-streamed Japanese artist worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-20"
      >
        <Image
          src="/images/roses-crown.svg"
          alt=""
          width={40}
          height={40}
          className="h-8 w-auto opacity-80 md:h-10"
        />
        <span className="text-xs tracking-widest text-foreground/40 uppercase">
          Scroll to explore
        </span>
        <div className="h-12 w-px bg-linear-to-b from-foreground/40 to-transparent" />
      </div>

      <div
        ref={transitionRef}
        className="absolute bottom-0 left-0 hidden h-1 w-full origin-left scale-x-0 bg-foreground md:block"
      />
    </section>
  );
}
