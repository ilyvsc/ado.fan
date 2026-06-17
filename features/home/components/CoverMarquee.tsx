"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { getAssetUrl, Image } from "@/components/ui/image";

gsap.registerPlugin(ScrollTrigger);

const rowA = [
  { slug: "songs/usseewa", title: "Usseewa" },
  { slug: "songs/show", title: "Show" },
  { slug: "songs/odo", title: "Odo" },
  { slug: "songs/gira-gira", title: "Gira Gira" },
  { slug: "songs/new-genesis", title: "New Genesis" },
  { slug: "songs/kura-kura", title: "Kura Kura" },
  { slug: "songs/im-invincible", title: "I'm Invincible" },
  { slug: "songs/backlight", title: "Backlight" },
  { slug: "songs/readymade", title: "Readymade" },
  { slug: "songs/rockstar", title: "Rockstar" },
  { slug: "songs/ashura-chan", title: "Ashura-chan" },
  { slug: "songs/rebellion", title: "Rebellion" },
  { slug: "songs/shoka", title: "Shoka" },
  { slug: "songs/value", title: "Value" },
  { slug: "songs/ibara", title: "Ibara" },
];

const rowB = [
  { slug: "songs/aitakute", title: "Aitakute" },
  { slug: "songs/all-night-radio", title: "All Night Radio" },
  { slug: "songs/atashi-wa-mondaisaku", title: "Atashi wa Mondaisaku" },
  { slug: "songs/bouquet-for-me", title: "Bouquet for Me" },
  { slug: "songs/cats-eye", title: "Cat's Eye" },
  { slug: "songs/chocolat-cadabra", title: "Chocolat Cadabra" },
  { slug: "songs/dignity", title: "Dignity" },
  { slug: "songs/eien-no-akuruhi", title: "Eien no Akuruhi" },
  { slug: "songs/elf", title: "Elf" },
  { slug: "songs/episode-x", title: "Episode X" },
  { slug: "songs/hello-signals", title: "Hello Signals" },
  { slug: "songs/himawari", title: "Himawari" },
  { slug: "songs/mirror", title: "Mirror" },
  { slug: "songs/missing", title: "Missing" },
  { slug: "songs/star-night-show", title: "Star Night Show" },
  { slug: "songs/sakura-biyori-time-machine", title: "Sakura Biyori & Time Machine" },
  { slug: "songs/yoru-no-pierrot", title: "Yoru no Pierrot" },
];

function CoverRow({
  items,
  rowRef,
  hidden,
}: {
  items: typeof rowA;
  rowRef: React.RefObject<HTMLDivElement | null>;
  hidden?: boolean;
}) {
  return (
    <div ref={rowRef} aria-hidden={hidden} className="flex w-max gap-3 md:gap-4">
      {items.map(({ slug, title }) => (
        <div
          key={slug}
          data-marquee-cover
          className="relative aspect-square w-40 shrink-0 overflow-hidden md:w-52 xl:w-56"
        >
          <Image
            src={getAssetUrl(slug)}
            alt={hidden ? "" : `${title} cover art`}
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function CoverMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const glide = (row: HTMLDivElement | null, direction: 1 | -1) => {
        if (!row) return;

        const distance = () =>
          Math.max(0, row.scrollWidth - (row.parentElement?.clientWidth ?? 0));

        gsap.fromTo(
          row,
          { x: () => (direction === 1 ? 0 : -distance()) },
          {
            x: () => (direction === 1 ? -distance() : 0),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      };

      glide(rowARef.current, 1);
      glide(rowBRef.current, -1);

      gsap.utils.toArray<HTMLElement>("[data-marquee-cover]").forEach((cover, i) => {
        const img = cover.querySelector("img");

        gsap.fromTo(
          cover,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            delay: (i % 15) * 0.05,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );

        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.2 },
          {
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
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
      className="overflow-hidden bg-background py-16 md:py-24"
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <CoverRow items={rowA} rowRef={rowARef} />
        <CoverRow items={rowB} rowRef={rowBRef} hidden />
      </div>
    </section>
  );
}
