"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronsDown } from "lucide-react";

import Link from "next/link";
import { useRef } from "react";

import { YouTubePlayer } from "@/components/VideoPlayer";
import { useIsMobile } from "@/components/ui/use-mobile";
import { linksCategories } from "@/lib/socialLinks";

const socialLinks = linksCategories["social-media"];

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const navigationLinks = [
  { label: "The Artist", href: "#who-is-ado" },
  { label: "Community", href: "#connect" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Lyrics Finder", href: "/lyrics" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const scrollEnd = isMobile ? "+=40%" : "+=60%";

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        titleTextRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotationX: -15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.6,
          ease: "power4.out",
        },
      ).fromTo(
        statsContainerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6",
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: scrollEnd,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const revealProgress = Math.max(0, (progress - 0.5) * 2);

          gsap.set(bgRef.current, {
            opacity: 1 - progress * 0.7,
            scale: 1 + progress * 0.05,
          });

          gsap.set(videoOverlayRef.current, {
            opacity: 1 - progress * 0.9,
          });

          gsap.set(titleRef.current, {
            y: -progress * 120,
            scale: 1 - progress * 0.15,
            opacity: 1 - progress * 1.8,
            rotationX: -progress * 8,
          });

          gsap.set(revealRef.current, {
            y: 100 - revealProgress * 100,
            opacity: revealProgress,
          });

          gsap.set(navContainerRef.current, {
            y: 50 - revealProgress * 50,
            opacity: revealProgress,
          });

          if (scrollIndicatorRef.current) {
            gsap.set(scrollIndicatorRef.current, {
              opacity: Math.max(0, 1 - progress * 3),
            });
          }
        },
      });
    },
    { scope: sectionRef },
  );

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 0 },
          ease: "power3.inOut",
        });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <YouTubePlayer
          youtubeId="_RAffg8JQ6g"
          extraParams="mute=1&controls=0&start=45&end=80&autoplay=1&loop=1"
          isFullscreenBackground
        />
      </div>

      <div
        ref={videoOverlayRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0"
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
        <div
          ref={titleRef}
          className="flex flex-col items-center gap-8 md:gap-12"
        >
          <div className="flex flex-col items-center">
            <h1
              ref={titleTextRef}
              className="relative font-gambarino text-[10rem] leading-none tracking-tighter text-transparent opacity-0 transition-all duration-700 text-shadow-white/10 text-shadow-xs hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] md:text-[12rem] lg:text-[16rem]"
              style={{
                WebkitTextStroke: "2px rgba(255, 255, 255, 1)",
              }}
            >
              Ado
            </h1>

            <div
              ref={statsContainerRef}
              className="mt-4 flex w-full max-w-3xl flex-col items-center gap-5 opacity-0 md:mt-12 md:gap-6"
            >
              <div className="grid w-full grid-cols-3 items-center justify-items-center gap-2 md:flex md:w-auto md:flex-row md:gap-12">
                <div className="group relative flex flex-col items-center gap-1">
                  <div className="relative flex items-baseline justify-center gap-1">
                    <span className="font-gambarino text-4xl leading-none font-bold text-white/90 transition-all duration-300 group-hover:text-white md:text-5xl">
                      2002
                    </span>
                    <div className="absolute -inset-2 -z-10 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <span className="text-center text-xs font-medium tracking-widest text-white/60 uppercase transition-all duration-300 group-hover:text-white/60">
                    Tokyo Born
                  </span>
                </div>

                <div className="hidden h-12 w-px bg-linear-to-b from-transparent via-white/20 to-transparent md:block" />

                <div className="group relative flex flex-col items-center gap-1">
                  <div className="relative flex justify-center gap-1">
                    <span className="font-gambarino text-4xl leading-none font-bold text-white/90 transition-all duration-300 group-hover:text-white md:text-5xl">
                      2020
                    </span>
                    <div className="absolute -inset-2 -z-10 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <span className="text-center text-xs font-medium tracking-widest text-white/60 uppercase transition-all duration-300 group-hover:text-white/60">
                    Debut Year
                  </span>
                </div>

                <div className="hidden h-12 w-px bg-linear-to-b from-transparent via-white/20 to-transparent md:block" />

                <div className="group relative flex flex-col items-center gap-1">
                  <div className="relative flex items-baseline justify-center gap-1">
                    <span className="font-gambarino text-4xl leading-none font-bold text-white/90 transition-all duration-300 group-hover:text-white md:text-5xl">
                      50+
                    </span>
                    <div className="absolute -inset-2 -z-10 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <span className="text-center text-xs font-medium tracking-widest text-white/60 uppercase transition-all duration-300 group-hover:text-white/60">
                    Original Songs
                  </span>
                </div>
              </div>

              <p className="max-w-2xl text-center text-sm leading-relaxed text-white/80 md:text-base">
                From Niconico covers inside a closet to becoming a global
                phenomenon. A voice that refuses to be seen, choosing music over
                image, art over appearance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={revealRef}
        className="absolute inset-x-0 bottom-0 z-30 flex min-h-96 flex-col items-center justify-center gap-6 p-4 opacity-0"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="relative font-gambarino text-5xl leading-tight font-bold text-white md:text-7xl">
            ADOMINATION
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-24 bg-white/20" />
            <p className="text-center text-sm font-light tracking-wide text-white/60 md:text-base">
              Japan's most enigmatic voice awaits
            </p>
            <div className="h-px w-24 bg-white/20" />
          </div>
        </div>

        <nav
          ref={navContainerRef}
          className="flex flex-col items-center gap-6 opacity-0"
        >
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-10">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="group relative text-sm font-medium tracking-wide text-white/70 transition-colors hover:text-white sm:text-base"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.description}
                className="text-white/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-3 hover:text-white"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-linear-to-r from-transparent to-white/30" />
            <span className="text-xs font-medium tracking-widest text-white/50 uppercase">
              Keep Scrolling
            </span>
            <div className="h-px w-8 bg-linear-to-l from-transparent to-white/30" />
          </div>
        </nav>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 [animation-duration:1.4s]"
      >
        <span className="text-xs tracking-widest text-white/40">SCROLL</span>
        <ChevronsDown className="h-6 w-6 text-white/40" />
      </div>
    </section>
  );
}
