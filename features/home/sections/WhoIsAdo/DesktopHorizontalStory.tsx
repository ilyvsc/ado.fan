"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { getAssetUrl, Image } from "@/components/ui/image";

gsap.registerPlugin(ScrollTrigger);

const adoBreakthrough = getAssetUrl("songs/usseewa");
const adoKigeki = getAssetUrl("avatar/chando/chando-nico-nico-plush");
const adoReflection = getAssetUrl("albums/uta-songs-one-piece-film-red");
const zanmuLetter = getAssetUrl("albums/zanmu");

interface StoryPanelData {
  title: string;
  pull: string;
  paragraphs: readonly string[];
  primary: string;
  secondary?: string;
}

const panels: readonly StoryPanelData[] = [
  {
    title: "Voice of the Underground",
    pull: "An ecosystem of hundreds of singers — and only one cut through.",
    paragraphs: [
      "She emerged from Japan's utaite scene, a community of singers known for giving their own voice to songs originally created within VOCALOID culture. By consistently covering works from popular producers, she built recognition through vocal performance alone.",
      "Each upload sharpened her craft and grew a devoted following. Not with technical perfection, but with an emotional intensity that felt visceral and unmistakable.",
    ],
    primary: adoKigeki,
  },
  {
    title: "Usseewa",
    pull: "100 million views. One song. A generation answered back.",
    paragraphs: [
      "In October 2020, Ado released her debut original song Usseewa, written by composer syudou. A raw, confrontational anthem that channeled the frustrations of a generation, it spread like wildfire — amassing over 100 million views within months.",
      "The song dominated charts, became a cultural phenomenon, and pushed Ado into the Japanese mainstream almost overnight. At just 17, she had become one of the most talked-about voices in the country.",
    ],
    primary: adoBreakthrough,
  },
  {
    title: "The World Listened",
    pull: "From a faceless avatar in Tokyo to millions in cinemas worldwide.",
    paragraphs: [
      "Her collaborations with Japan's most respected composers continued — Odo, Gira Gira, Yoru no Pierrot — each showcasing a different facet of her vocal ability.",
      "These projects led to her debut album Kyōgen and then her biggest opportunity: the singing voice of Uta in One Piece Film: Red. For millions of new listeners worldwide, this was their first encounter with her voice.",
    ],
    primary: adoReflection,
    secondary: zanmuLetter,
  },
];

function ProgressIndicator({
  progressRef,
}: {
  progressRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="pointer-events-none absolute top-8 right-12 left-12 z-30 flex items-center gap-6 xl:right-16 xl:left-16">
      <span className="font-serif text-sm tracking-widest text-foreground/60 uppercase">
        The Story
      </span>
      <div className="relative h-px flex-1 bg-foreground/10">
        <div
          ref={progressRef}
          className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-ado-primary"
        />
      </div>
      <span className="font-serif text-sm tracking-widest text-foreground/60">
        {String(panels.length).padStart(2, "0")}
      </span>
    </div>
  );
}

function PanelOne({ data }: { data: StoryPanelData }) {
  return (
    <article className="story-panel relative flex h-full w-screen shrink-0 items-center justify-center px-12 xl:px-16">
      <div className="grid w-full max-w-7xl grid-cols-12 items-center gap-12 xl:gap-16">
        <div className="story-image col-span-5">
          <div className="relative aspect-3/4 w-full overflow-hidden">
            <Image
              src={data.primary}
              alt={data.title}
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="story-copy col-span-7 space-y-6">
          <h2 className="font-serif text-5xl leading-tight font-bold text-foreground xl:text-6xl">
            {data.title}
          </h2>

          <div className="max-w-xl space-y-4">
            {data.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-8 text-muted-foreground md:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function PanelTwo({ data }: { data: StoryPanelData }) {
  return (
    <article className="story-panel relative flex h-full w-screen shrink-0 items-center justify-center px-12 xl:px-16">
      <div className="grid w-full max-w-7xl grid-cols-12 items-center gap-12 xl:gap-16">
        <div className="story-copy order-2 col-span-6 space-y-6">
          <h2 className="font-serif text-5xl leading-none font-bold text-foreground xl:text-7xl">
            {data.title}
          </h2>

          <p className="border-l-2 border-ado-primary pl-6 font-serif text-2xl leading-snug text-foreground italic xl:text-3xl">
            “{data.pull}”
          </p>

          <div className="max-w-xl space-y-4">
            {data.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-8 text-muted-foreground md:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="story-image order-1 col-span-6">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={data.primary}
              alt={data.title}
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function PanelThree({ data }: { data: StoryPanelData }) {
  return (
    <article className="story-panel relative flex h-full w-screen shrink-0 items-center justify-center px-12 xl:px-16">
      <div className="grid w-full max-w-7xl grid-cols-12 items-center gap-8 xl:gap-12">
        <div className="story-copy col-span-5 space-y-6">
          <h2 className="font-serif text-5xl leading-tight font-bold text-foreground xl:text-7xl">
            {data.title}
          </h2>

          <div className="max-w-xl space-y-4">
            {data.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-8 text-muted-foreground md:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="story-image col-span-4">
          <div className="relative aspect-3/4 w-full overflow-hidden">
            <Image
              src={data.primary}
              alt={data.title}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="story-thumb col-span-3 flex flex-col gap-6">
          {data.secondary && (
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={data.secondary}
                alt={`${data.title} secondary`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="border-l-2 border-ado-primary pl-4 font-serif text-lg leading-snug text-foreground italic">
            “{data.pull}”
          </p>
        </div>
      </div>
    </article>
  );
}

const layouts = [PanelOne, PanelTwo, PanelThree] as const;

export function DesktopHorizontalStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      const q = gsap.utils.selector(containerRef);
      const panelEls = q(".story-panel");
      const track = trackRef.current;
      const container = containerRef.current;

      gsap.set(container, { height: "100dvh" });

      const getScrollWidth = () => track.scrollWidth - container.clientWidth;

      if (getScrollWidth() <= 0) return;

      const scrollTween = gsap.to(track, {
        x: () => -getScrollWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollWidth()}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const cleanups: (() => void)[] = [];

      panelEls.forEach((panel) => {
        const numeral = panel.querySelector(".story-numeral");
        const image = panel.querySelector(".story-image");
        const copy = panel.querySelector(".story-copy");
        const thumb = panel.querySelector(".story-thumb");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left 85%",
            end: "left 30%",
            scrub: true,
          },
        });

        if (numeral) {
          tl.from(numeral, { autoAlpha: 0, y: 40, ease: "none" }, 0);
        }
        if (image) {
          tl.from(image, { autoAlpha: 0, x: 60, scale: 0.94, ease: "none" }, 0.05);
        }
        if (copy) {
          tl.from(copy, { autoAlpha: 0, y: 50, ease: "none" }, 0.12);
        }
        if (thumb) {
          tl.from(thumb, { autoAlpha: 0, y: 30, ease: "none" }, 0.18);
        }

        cleanups.push(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      });

      if (progressRef.current) {
        const progressEl = progressRef.current;

        const progressST = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollWidth()}`,
          scrub: 0.4,
          onUpdate: (self) => {
            gsap.set(progressEl, { scaleX: self.progress });
          },
        });

        cleanups.push(() => {
          progressST.kill();
        });
      }

      return () => {
        gsap.set(container, { clearProps: "height" });
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
        cleanups.forEach((fn) => {
          fn();
        });
      };
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="horizontal-story-section relative hidden overflow-hidden bg-background lg:block"
    >
      <ProgressIndicator progressRef={progressRef} />

      <div ref={trackRef} className="relative z-10 flex h-full">
        {panels.map((panel, index) => {
          const Layout = layouts[index % layouts.length] ?? PanelOne;
          return <Layout key={panel.title} data={panel} />;
        })}
      </div>
    </section>
  );
}
