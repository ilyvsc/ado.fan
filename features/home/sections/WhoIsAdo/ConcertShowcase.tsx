"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useCallback, useRef, useState } from "react";

import { getAssetUrl, Image } from "@/components/ui/image";
import { Lightbox, type LightboxProps } from "@/shared/components/ui/lightbox";
import { cn } from "@/shared/lib/utils";

import { ConcertVideoSection } from "./ConcertVideoSection";
import { type ConcertEntry, videoConcerts, concerts } from "./WhoIsAdo";

gsap.registerPlugin(ScrollTrigger);

function MobileConcertCard({ concert }: { concert: ConcertEntry }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const article = ref.current;
      if (!article) return;

      const q = gsap.utils.selector(article);
      const image = q(".concert-mobile-image")[0];
      const overlay = q(".concert-mobile-overlay")[0];
      const content = q(".concert-mobile-content")[0];

      if (!image || !content) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: article,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        image,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power4.inOut" },
        0,
      );

      if (overlay) {
        tl.from(
          overlay,
          { autoAlpha: 0, y: 30, duration: 0.7, ease: "power3.out" },
          0.5,
        );
      }

      tl.from(
        content,
        { autoAlpha: 0, y: 24, duration: 0.7, ease: "power3.out" },
        0.65,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: ref },
  );

  return (
    <article ref={ref}>
      <div className="concert-mobile-image relative aspect-4/5 w-full overflow-hidden">
        <Image
          src={concert.hero}
          alt={concert.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        <div className="concert-mobile-overlay absolute inset-x-0 bottom-0 p-6">
          <h2 className="font-serif text-5xl leading-none font-bold text-white">
            {concert.title}
          </h2>
        </div>
      </div>
      <div className="concert-mobile-content space-y-4 px-6 py-8">
        <p className="text-xl leading-snug font-medium text-ado-primary-foreground">
          {concert.headline}
        </p>
        {concert.paragraphs.map((p) => (
          <p
            key={p.slice(0, 24)}
            className="text-base leading-7 text-ado-primary-foreground/80"
          >
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}

export function MobileConcertStory() {
  return (
    <section className="space-y-4 bg-ado-primary lg:hidden">
      {concerts.map((concert) => (
        <MobileConcertCard key={concert.id} concert={concert} />
      ))}
    </section>
  );
}

function StackedConcertCard({
  concert,
  index,
  isLast,
}: {
  concert: ConcertEntry;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<LightboxProps | null>(null);
  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const imageOnRight = index % 2 === 0;

  useGSAP(
    () => {
      const card = ref.current;
      if (!card) return;

      gsap.set(card, { height: "88dvh", top: "6dvh" });

      const q = gsap.utils.selector(card);
      const title = q(".stack-title")[0];
      const headline = q(".stack-headline")[0];
      const paras = q(".stack-para");
      const thumbs = q(".stack-thumb");
      const portrait = q(".stack-portrait")[0];
      const portraitImg = q(".stack-portrait img")[0];
      const veil = q(".stack-veil")[0];
      const inner = q(".stack-inner")[0];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { clipPath: "inset(0 0 100% 0)", y: 40 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1,
            ease: "power4.out",
          },
          0.15,
        );
      }

      if (headline) {
        tl.from(
          headline,
          { autoAlpha: 0, y: 20, duration: 0.6, ease: "power3.out" },
          0.45,
        );
      }

      tl.from(
        paras,
        { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        0.55,
      ).from(
        thumbs,
        { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.6, ease: "power3.out" },
        0.7,
      );

      if (portrait) {
        tl.fromTo(
          portrait,
          { clipPath: imageOnRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0%)", duration: 1.2, ease: "power4.inOut" },
          0,
        );
      }

      const cleanups: (() => void)[] = [];

      if (portraitImg) {
        const parallax = gsap.fromTo(
          portraitImg,
          { scale: 1.15, yPercent: -4 },
          {
            scale: 1.15,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        cleanups.push(() => {
          parallax.scrollTrigger?.kill();
          parallax.kill();
        });
      }

      if (!isLast && inner && veil) {
        const depth = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        depth
          .to(inner, { scale: 0.94, ease: "none" }, 0)
          .to(veil, { opacity: 0.55, ease: "none" }, 0);

        cleanups.push(() => {
          depth.scrollTrigger?.kill();
          depth.kill();
        });
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        cleanups.forEach((fn) => {
          fn();
        });
        gsap.set(card, { clearProps: "height,top" });
      };
    },
    { scope: ref, dependencies: [imageOnRight, isLast] },
  );

  return (
    <>
      <article ref={ref} className="sticky overflow-hidden bg-background">
        <div className="stack-inner h-full">
          <div className="grid h-full grid-cols-12">
            <div
              className={cn(
                "col-span-7 flex h-full flex-col justify-center gap-5 px-12 xl:px-20",
                imageOnRight ? "order-1" : "order-2",
              )}
            >
              <h2 className="stack-title font-serif text-7xl leading-none font-bold text-foreground xl:text-8xl">
                {concert.title}
              </h2>

              <p className="stack-headline text-xl leading-snug font-medium text-ado-primary xl:text-2xl">
                {concert.headline}
              </p>

              <div className="max-w-2xl space-y-4">
                {concert.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="stack-para text-base leading-7 text-muted-foreground"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="flex max-w-2xl gap-3">
                {concert.stack.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      setLightbox({
                        src: img,
                        alt: `${concert.title} ${String(i + 1)}`,
                      });
                    }}
                    className="stack-thumb group relative aspect-square flex-1 cursor-zoom-in overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`${concert.title} ${String(i + 1)}`}
                      fill
                      sizes="12vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-ado-primary/0 transition-colors duration-300 group-hover:bg-ado-primary/30" />
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "stack-portrait relative col-span-5 h-full overflow-hidden",
                imageOnRight ? "order-2" : "order-1",
              )}
            >
              <Image
                src={concert.hero}
                alt={concert.title}
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="stack-veil pointer-events-none absolute inset-0 bg-black opacity-0" />
      </article>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
    </>
  );
}

export function ConcertTimelineStory() {
  return (
    <section className="relative hidden lg:block">
      <ConcertVideoSection
        entries={videoConcerts}
        videoSrc={getAssetUrl("/hatsune-slow.mp4")}
      />
      <div className="relative">
        {concerts.map((concert, index) => (
          <StackedConcertCard
            key={concert.id}
            concert={concert}
            index={index}
            isLast={index === concerts.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
