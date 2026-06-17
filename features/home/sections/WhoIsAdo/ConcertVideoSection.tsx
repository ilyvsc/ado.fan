"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { Image } from "@/components/ui/image";

import { ConcertEntry } from "./WhoIsAdo";

gsap.registerPlugin(ScrollTrigger);

function VideoPart({ entry, videoSrc }: { entry: ConcertEntry; videoSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const video = videoRef.current;
      if (!container || !video) return;

      const q = gsap.utils.selector(container);
      const flood = q(".video-flood")[0];
      const bigTitle = q(".video-big-title")[0];
      const letters = q(".video-letter");

      gsap.set(container, { height: "100dvh" });
      if (flood) gsap.set(flood, { opacity: 0 });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      intro.fromTo(
        letters,
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.05, duration: 1, ease: "power4.out" },
        0,
      );

      let st: ScrollTrigger | null = null;

      const build = () => {
        if (!video.duration) return;

        st = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "+=180%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            gsap.to(video, {
              currentTime: progress * video.duration,
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            });

            gsap.set(video, { scale: 1 + progress * 0.08 });

            if (flood) {
              gsap.set(flood, {
                opacity: progress > 0.5 ? (progress - 0.5) / 0.5 : 0,
              });
            }

            if (bigTitle) {
              gsap.set(bigTitle, {
                letterSpacing: `${progress * 0.25}em`,
                opacity: 1 - Math.max(0, (progress - 0.6) / 0.3),
              });
            }
          },
        });

        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1) build();
      else video.addEventListener("loadedmetadata", build, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", build);
        st?.kill();
        intro.scrollTrigger?.kill();
        intro.kill();
        gsap.set(container, { clearProps: "height" });
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover select-none"
        src={videoSrc}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h2 className="video-big-title flex font-serif text-7xl font-bold text-white uppercase mix-blend-difference xl:text-9xl">
          {entry.title.split("").map((char, i) => (
            <span
              key={`${entry.id}-${String(i)}`}
              className="inline-block overflow-hidden"
            >
              <span className="video-letter inline-block">{char}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="video-flood pointer-events-none absolute inset-0 bg-ado-primary" />
    </div>
  );
}

function ContentPart({ entry }: { entry: ConcertEntry }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.set(section, { marginTop: "-100vh" });

      const q = gsap.utils.selector(section);
      const title = q(".content-title")[0];
      const headline = q(".content-headline")[0];
      const paras = q(".content-para");
      const figures = q(".content-figure");

      if (title && headline) {
        const intro = gsap.timeline({
          scrollTrigger: {
            trigger: title,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });

        intro
          .fromTo(
            title,
            { clipPath: "inset(0 0 100% 0)", y: 60 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 1.2,
              ease: "power4.out",
            },
            0,
          )
          .from(
            headline,
            { autoAlpha: 0, y: 28, duration: 0.8, ease: "power3.out" },
            0.4,
          );

        intro.from(
          paras,
          { autoAlpha: 0, y: 24, stagger: 0.15, duration: 0.7, ease: "power3.out" },
          0.7,
        );
      }

      figures.forEach((figure, i) => {
        const img = figure.querySelector("img");

        gsap.fromTo(
          figure,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            delay: i * 0.15,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: figure,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        if (!img) return;

        gsap.fromTo(
          img,
          { scale: 1.25 },
          {
            scale: 1.1,
            duration: 1.6,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: figure,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: figure,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-transparent px-8 pt-8 pb-32"
    >
      <div className="relative mx-auto max-w-6xl pt-72">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h2 className="content-title font-serif text-8xl leading-none font-bold text-ado-primary-foreground xl:text-9xl">
            {entry.title}
          </h2>
          <p className="content-headline font-serif text-2xl leading-snug text-ado-primary-foreground/90 italic xl:text-3xl">
            {entry.headline}
          </p>
          <div className="mx-auto max-w-3xl columns-1 gap-12 space-y-5 pt-4 text-left xl:columns-2">
            {entry.paragraphs.map((p, i) => (
              <p
                key={i}
                className="content-para text-base leading-7 text-ado-primary-foreground/80"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-6">
          {entry.stack.slice(0, 3).map((img, i) => (
            <div
              key={img}
              className="content-figure relative aspect-3/4 overflow-hidden"
            >
              <Image
                src={img}
                alt={`${entry.title} ${String(i + 1)}`}
                fill
                sizes="33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConcertVideoSection({
  entries,
  videoSrc,
}: {
  entries: readonly ConcertEntry[];
  videoSrc: string;
}) {
  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id} className="bg-ado-primary">
          <VideoPart entry={entry} videoSrc={videoSrc} />
          <ContentPart entry={entry} />
        </div>
      ))}
    </>
  );
}
