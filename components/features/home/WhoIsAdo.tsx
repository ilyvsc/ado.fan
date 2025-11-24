"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { memo, useRef } from "react";

import adoAvatar from "@/public/images/ado-avatar.jpg";

gsap.registerPlugin(ScrollTrigger);

const AdoDescription = memo(function AdoDescription() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center lg:items-start lg:text-left"
    >
      <h2 className="font-gambarino text-4xl text-foreground md:text-5xl">
        A Voice That Shatters Boundaries
      </h2>

      <p className="mt-6 text-lg leading-relaxed font-light text-muted-foreground md:text-xl">
        Ado is a Japanese utaite who began her career covering Vocaloid songs,
        using a stylized avatar to represent herself. She has since transcended
        the utaite scene, releasing original music in collaboration with
        acclaimed composers and lyricists, establishing herself as one of
        Japan's most distinctive and influential vocalists.
      </p>
    </div>
  );
});

const AdoExtraInfo = memo(function AdoExtraInfo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center lg:items-start lg:text-left"
    >
      <h2 className="font-gambarino text-4xl text-foreground md:text-5xl">
        Beyond the Digital Stage
      </h2>

      <p className="mt-6 text-lg leading-relaxed font-light text-muted-foreground md:text-xl">
        With her signature powerful vocals and emotional depth, Ado has captured
        millions of hearts worldwide. Her music videos regularly achieve tens of
        millions of views, and her live performances showcase a rare combination
        of technical prowess and raw authenticity that defines a new generation
        of Japanese artists breaking into the global music scene.
      </p>
    </div>
  );
});

export function WhoIsAdo() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayOneRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    if (imageRef.current) {
      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }

    if (overlayOneRef.current) {
      gsap.fromTo(
        overlayOneRef.current,
        { yPercent: -100 },
        {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            scrub: true,
          },
        },
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative lg:py-24">
      <div className="mx-auto w-full max-w-none px-0 sm:px-0">
        {/* Mobile & Tablet Layout */}
        <div className="block lg:hidden">
          <div className="relative h-[300vh] w-full">
            <div className="sticky top-0 z-0 h-screen w-full">
              <Image
                src={adoAvatar}
                alt="Ado - Japanese singer and artist character"
                className="object-cover"
                aria-hidden="true"
                priority
                fill
              />
            </div>

            <div
              ref={overlayOneRef}
              className="sticky top-0 z-10 h-screen w-full bg-background"
            >
              <div className="flex h-full w-full items-center justify-center px-6 sm:px-8 md:px-12">
                <div className="w-full max-w-2xl">
                  <AdoDescription />
                </div>
              </div>
            </div>

            <div className="sticky top-0 z-20 h-screen w-full bg-background">
              <div className="flex h-full w-full items-center justify-center px-6 sm:px-8 md:px-12">
                <div className="w-full max-w-2xl">
                  <AdoExtraInfo />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="relative hidden items-start lg:flex">
          <div className="mx-auto max-w-3xl flex-1 px-8">
            <div className="mb-16">
              <AdoDescription />
            </div>
            <div>
              <AdoExtraInfo />
            </div>
          </div>

          <div
            ref={imageRef}
            className="sticky h-[90vh] w-[45vw] flex-shrink-0 overflow-hidden rounded-l-4xl"
          >
            <Image
              src={adoAvatar}
              alt="Ado - Japanese singer and artist character"
              className="object-cover"
              aria-hidden="true"
              priority
              fill
            />
          </div>
        </div>
      </div>
    </section>
  );
}
