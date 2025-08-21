"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { memo, useRef } from "react";

import { useTextAnimate } from "@/animations/textAnimation";
import adoAvatar from "@/public/images/ado-avatar.jpg";

gsap.registerPlugin(ScrollTrigger);

const AdoDescription = memo(function AdoDescription() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useTextAnimate(titleRef, textRef);

  return (
    <div className="flex flex-col items-center lg:items-start lg:text-left">
      <h2
        ref={titleRef}
        className="font-editorial text-2xl text-foreground md:text-3xl lg:text-4xl"
      >
        A Voice That Shatters Boundaries
      </h2>

      <p
        ref={textRef}
        className="mt-6 text-xl leading-relaxed text-muted-foreground"
      >
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useTextAnimate(titleRef, textRef);

  return (
    <div className="flex flex-col items-center lg:items-start lg:text-left">
      <h2
        ref={titleRef}
        className="font-playfair text-2xl text-foreground md:text-3xl lg:text-4xl"
      >
        Beyond the Digital Stage
      </h2>

      <p
        ref={textRef}
        className="mt-6 text-xl leading-relaxed text-muted-foreground"
      >
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
  const mobileImageRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    if (imageRef.current) {
      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }

    if (backgroundRef.current) {
      gsap.fromTo(
        backgroundRef.current,
        { yPercent: -100 },
        {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "30% top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=30% top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative lg:py-24">
      <div className="mx-auto w-full max-w-none px-0 sm:px-0 lg:max-w-7xl">
        {/* Mobile & Tablet Layout */}
        <div className="block lg:hidden">
          <div className="relative h-[300vh] w-full">
            <div
              className="sticky top-0 z-0 h-screen w-full"
              ref={mobileImageRef}
            >
              <Image
                src={adoAvatar}
                alt="ADO - Japanese singer and artist"
                fill
                className="object-cover"
                priority
                aria-hidden="true"
              />
            </div>

            <div
              ref={backgroundRef}
              className="sticky top-0 z-10 h-screen w-full bg-background"
            >
              <div className="flex h-full w-full items-center justify-center px-6 sm:px-8 md:px-12">
                <div className="w-full max-w-2xl">
                  <AdoDescription />
                </div>
              </div>
            </div>

            <div
              ref={contentRef}
              className="sticky top-0 z-20 h-screen w-full bg-background"
            >
              <div className="flex h-full w-full items-center justify-center px-6 sm:px-8 md:px-12">
                <div className="w-full max-w-2xl">
                  <AdoExtraInfo />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="mb-16 w-full max-w-2xl">
            <AdoDescription />
          </div>

          <div className="grid grid-cols-2 items-center gap-16 px-8">
            <div
              ref={imageRef}
              className="relative h-full min-h-[700px] overflow-hidden rounded-xl"
            >
              <Image
                src={adoAvatar}
                alt="ADO - Japanese singer and artist"
                fill
                className="object-cover"
                priority
                aria-hidden="true"
              />
            </div>

            <div className="w-full max-w-2xl">
              <AdoExtraInfo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
