"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { useRef } from "react";

import { getAssetUrl, Image } from "@/components/ui/image";
import { cn } from "@/shared/lib/utils";

import { ConcertTimelineStory, MobileConcertStory } from "./ConcertShowcase";
import { DesktopHorizontalStory } from "./DesktopHorizontalStory";

const adoBreakthrough = getAssetUrl("songs/usseewa");
const adoAvatar = getAssetUrl("avatar/ado-chando-avatar");
const adoKigeki = getAssetUrl("avatar/chando/chando-nico-nico-plush");
const ado2ndLive = getAssetUrl("tours/mars/ado-mars-wallpaper");
const adoReflection = getAssetUrl("albums/uta-songs-one-piece-film-red");
const yodakaShow = getAssetUrl("tours/yodaka/ado-yodaka-promotional-banner");
const shinzou1 = getAssetUrl("tours/shinzou/ado-special-live-shinzou-banner");
const shinzouConcert = getAssetUrl("tours/shinzou/gallery/shinzou_concert_2024");
const shinzouRed = getAssetUrl(
  "tours/shinzou/gallery/shinzou_concert_hatsune_miku_2024.jpg",
);
const shinzouLogo = getAssetUrl("tours/shinzou/ado-shinzou-live-logo.png");
const wishPromo = getAssetUrl("tours/wish/ado-wish-promotional-banner.jpg");
const wishTourBangkok = getAssetUrl("tours/wish/gallery/wish-tour-bangkok-2024");
const wishTourChicago = getAssetUrl("tours/wish/gallery/wish-tour-chicago-2024");
const wishTourDusseldorf = getAssetUrl(
  "tours/wish/gallery/wish-tour-dusseldorf-2024",
);
const wishTourJakarta = getAssetUrl("tours/wish/gallery/wish-tour-jakarta-2024");
const wishTourLosAngeles = getAssetUrl(
  "tours/wish/gallery/wish-tour-los-angeles-2024",
);
const wishTourNewYork = getAssetUrl("tours/wish/gallery/wish-tour-newyork-2024");
const wishTourParis = getAssetUrl("tours/wish/gallery/wish-tour-paris-2024");
const wishTourSeoul = getAssetUrl("tours/wish/gallery/wish-tour-seoul-2024");
const hibanaPromo = getAssetUrl("tours/hibana/ado-hibana-promotional-banner");
const adoMars = getAssetUrl("tours/hibana/ado-hibana-wallpaper");

const storyPanels = [
  {
    id: "01",
    title: "Voice of the Underground",
    image: adoKigeki,
    paragraphs: [
      "She emerged from Japan's utaite scene, a community of singers known for giving their own voice to songs originally created within VOCALOID culture. By consistently covering works from popular producers, she built recognition through vocal performance alone.",
      "Her raw power and emotional range set her apart.",
      "Each upload sharpened her craft and grew a devoted following. In an ecosystem where hundreds of singers competed for attention, Ado's voice cut through  not with technical perfection, but with an emotional intensity that felt visceral and unmistakable.",
    ],
  },
  {
    id: "02",
    title: "Usseewa",
    image: adoBreakthrough,
    paragraphs: [
      "In October 2020, Ado released her debut original song Usseewa, written by composer syudou. A raw, confrontational anthem that channeled the frustrations of a generation, it spread like wildfire  amassing over 100 million views within months.",
      "The song dominated charts, became a cultural phenomenon, and pushed Ado into the Japanese mainstream almost overnight. At just 17, she had become one of the most talked-about voices in the country.",
    ],
  },
  {
    id: "03",
    title: "The World Listened",
    image: adoReflection,
    paragraphs: [
      "Her collaborations with Japan's most respected composers continued  Odo, Gira Gira, Yoru no Pierrot  each showcasing a different facet of her vocal ability.",
      "These projects led to her debut album Kyōgen and then her biggest opportunity: the singing voice of Uta in One Piece Film: Red. For millions of new listeners worldwide, this was their first encounter with her voice.",
    ],
  },
] as const;

export interface ConcertEntry {
  id: string;
  year: string;
  title: string;
  headline: string;
  hero: string;
  stack: readonly string[];
  paragraphs: readonly string[];
  logo?: string;
}

export const concerts: readonly ConcertEntry[] = [
  {
    id: "wish",
    year: "2024",
    title: "Wish",
    headline: "One voice, carried across three continents.",
    hero: wishPromo,
    stack: [wishTourSeoul, wishTourNewYork, wishTourParis, wishTourLosAngeles],
    paragraphs: [
      "Her first world tour launched in 2024 and brought Ado's music to audiences across Asia, Europe, and North America. From sold-out shows in Seoul and Taipei to packed venues in London, Paris, and New York, she proved that the energy of her performances transcended language.",
      "Each city brought new fans, and the tour marked the beginning of Ado's identity as a truly global artist. The audiences who gathered had discovered her through different paths  anime, viral covers, algorithm recommendations  but they all came for the same thing: her voice.",
      "What struck observers most was not the logistics but the crowds. International fans singing along to Japanese songs they had learned word for word. Language posed no barrier. Voice was the only currency that mattered.",
    ],
  },
  {
    id: "hibana",
    year: "2025",
    title: "Hibana",
    headline: "Her audience was never a trend. It was a foundation.",
    hero: hibanaPromo,
    stack: [hibanaPromo, wishTourChicago, wishTourDusseldorf],
    paragraphs: [
      "In 2025, Ado returned to the world stage with Hibana, one of the largest world tours ever undertaken by a Japanese artist. The tour expanded her reach even further, covering more cities and considerably larger venues than Wish.",
      "By this point, she had built something rare  an international community that transcended language and geography, bound together by the shared experience of her performances. Hibana was not a follow-up. It was a confirmation.",
      "Each stop added new momentum. Artists of Ado's scale from Japan rarely sustain international traction beyond a single wave. Hibana proved that her audience was not a trend but a foundation, something that would grow rather than plateau.",
    ],
  },
  {
    id: "yodaka",
    year: "2025",
    title: "Yodaka",
    headline: "From anonymous covers to Japan's grandest domes.",
    hero: yodakaShow,
    stack: [yodakaShow, wishTourJakarta, wishTourBangkok],
    paragraphs: [
      "In late 2025, Ado returned to Japan for her first dome tour. With performances at Tokyo Dome and Kyocera Dome Osaka, Yodaka marked a culmination of five years of relentless growth.",
      "From anonymous teenager uploading covers to one of Japan's most prominent musical voices  the journey from NicoNico to Tokyo Dome was complete. And yet, for Ado, this was not an ending. It was simply the latest chapter in a story still being written.",
      "Standing before capacity crowds at Japan's most iconic venues, the contradiction that had always defined her remained intact: a voice that could fill any space, belonging to a face no one had ever seen. The mystery, it turned out, had never diminished the connection. It had deepened it.",
    ],
  },
];

export const videoConcerts: readonly ConcertEntry[] = [
  {
    id: "shinzou",
    year: "2024",
    title: "Shinzou",
    headline: "The first woman to ever headline Japan's National Stadium.",
    hero: shinzou1,
    logo: shinzouLogo,
    stack: [shinzou1, shinzouConcert, shinzouRed],
    paragraphs: [
      "In 2024, Ado presented her most ambitious concert to date: Shinzou, a two-day solo performance at Japan National Stadium. She became the first female artist to perform at the venue, drawing over 100,000 fans across both nights.",
      "That same year, her Japan tour Profile of Mona Lisa revealed a more personal side, including the first live performance of Shoka, a song she wrote herself. Each show felt less like a concert and more like a document of someone becoming exactly who they were meant to be.",
      "The production matched the scale of the venue. Elaborate stagecraft, shifting visuals, and a sense of controlled chaos turned the stadium floor into an extension of the music itself. The faceless singer who refused to reveal herself had instead built one of Japan's most visually immersive live experiences.",
    ],
  },
];

function AnimatedImage({
  src,
  alt,
  sizes,
  className,
  preload = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const q = gsap.utils.selector(ref);
      const image = q(".animated-image")[0];
      if (!image) return;

      const reveal = gsap.from(ref.current, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      const parallax = gsap.to(image, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className="animated-image object-cover"
      />
    </div>
  );
}

function OverlayReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayOneRef = useRef<HTMLDivElement>(null);
  const overlayTwoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !overlayOneRef.current || !overlayTwoRef.current)
        return;

      gsap.set(overlayOneRef.current, { yPercent: -100 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      });

      tl.fromTo(
        overlayOneRef.current,
        { yPercent: -100 },
        { yPercent: 100, ease: "none" },
        0,
      ).to(overlayTwoRef.current, { yPercent: -100, ease: "none" }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {children}
      <div ref={overlayOneRef} className="absolute inset-0 z-10 bg-ado-primary" />
      <div ref={overlayTwoRef} className="absolute inset-0 z-20 bg-background" />
    </div>
  );
}

function DesktopStory() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const q = gsap.utils.selector(ref);
      const heading = q(".intro-heading")[0];
      const text = q(".intro-text")[0];
      const textCol = q(".intro-text-col")[0];
      if (!heading || !text || !textCol) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        heading,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
        },
        0,
      ).from(
        text,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        0.3,
      );

      const parallax = gsap.to(textCol, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-7 items-center gap-14 px-10 xl:px-12">
        <div className="intro-text-col col-span-4 space-y-6">
          <h1 className="intro-heading max-w-2xl font-serif text-4xl leading-tight font-bold text-foreground xl:text-5xl">
            A voice built outside the spotlight.
          </h1>
          <div className="intro-text max-w-xl space-y-4">
            <p className="text-justify text-base leading-8 text-muted-foreground md:text-lg">
              Born in Tokyo in 2002, Ado began sharing song covers online as a
              teenager, uploading her performances to NicoNico. She emerged from
              Japan&apos;s utaite scene a community of singers known for giving their
              own voice to VOCALOID songs and built recognition through vocal
              performance alone.
            </p>
            <p className="text-justify text-base leading-8 text-muted-foreground md:text-lg">
              What set her apart was never polished presentation. It was the raw
              emotional weight of her voice a delivery that could shift from whispered
              vulnerability to explosive rage within a single phrase. Before the world
              knew her name, the underground already understood what she was becoming.
            </p>
          </div>
        </div>

        <AnimatedImage
          src={adoAvatar}
          alt="Ado portrait"
          sizes="40vw"
          className="col-span-3 aspect-3/4"
          preload
        />
      </div>
    </section>
  );
}

function MobileStory() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const q = gsap.utils.selector(ref);
      const blocks = q(".mobile-block");

      const anim = gsap.from(blocks, {
        y: 30,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="space-y-8 p-6">
      <OverlayReveal className="mobile-block aspect-3/4">
        <Image
          src={adoAvatar}
          alt="Ado portrait"
          fill
          sizes="100vw"
          className="object-cover"
          preload
        />
      </OverlayReveal>

      {storyPanels.map((panel) => (
        <article key={panel.id} className="mobile-block space-y-5">
          <h2 className="font-serif text-3xl leading-tight font-bold text-foreground md:text-5xl xl:text-6xl">
            {panel.title}
          </h2>
          <div className="space-y-6">
            {panel.paragraphs.map((p) => (
              <p key={p} className="text-justify text-base text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
          <AnimatedImage
            src={panel.image}
            alt={panel.title}
            sizes="100vw"
            className="h-64"
          />
        </article>
      ))}
      <div className="mobile-block grid grid-cols-2 gap-2">
        <AnimatedImage
          src={ado2ndLive}
          alt="2nd Live performance"
          sizes="50vw"
          className="aspect-3/4"
        />
        <AnimatedImage
          src={adoMars}
          alt="Mars concert"
          sizes="50vw"
          className="aspect-3/4"
        />
      </div>
    </div>
  );
}

export function WhoIsAdo() {
  return (
    <section>
      <div className="lg:hidden">
        <MobileStory />
      </div>
      <div className="hidden lg:block">
        <DesktopStory />
        <DesktopHorizontalStory />
      </div>
      <MobileConcertStory />
      <ConcertTimelineStory />
    </section>
  );
}
