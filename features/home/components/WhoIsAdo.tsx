"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { createContext, useContext, useRef, useState } from "react";

import adoAvatar from "@/public/images/ado-avatar.jpg";
import { cn } from "@/shared/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ThemeContext = createContext(false);

function Highlight({
  children,
  italic = false,
}: {
  children: React.ReactNode;
  italic?: boolean;
}) {
  const isPastMiddle = useContext(ThemeContext);
  return (
    <span
      className={cn(
        "inline cursor-pointer rounded-sm px-1 py-0.5 font-semibold text-ado-primary-foreground transition-all duration-300 md:p-1 md:whitespace-nowrap",
        isPastMiddle
          ? "bg-ado-primary-foreground/20 hover:bg-ado-primary-foreground/30"
          : "bg-ado-primary/80 hover:bg-ado-primary",
        italic && "italic",
      )}
    >
      {children}
    </span>
  );
}

function AdoDescription() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPastMiddle = useContext(ThemeContext);

  useGSAP(
    () => {
      gsap.from(".ado-desc-content > *", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="flex items-stretch gap-6">
      <div className="ado-desc-content flex flex-col text-left">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              "h-px w-12 transition-colors duration-700",
              isPastMiddle
                ? "bg-ado-primary-foreground/70"
                : "bg-ado-primary/70",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium tracking-widest uppercase transition-colors duration-700 sm:text-sm",
              isPastMiddle
                ? "text-ado-primary-foreground/80"
                : "text-ado-primary",
            )}
          >
            The Artist
          </span>
          <div
            className={cn(
              "h-px flex-1 transition-colors duration-700",
              isPastMiddle
                ? "bg-ado-primary-foreground/70"
                : "bg-ado-primary/70",
            )}
          />
        </div>

        <h2
          className={cn(
            "font-gambarino text-4xl leading-tight font-bold transition-colors duration-700 lg:text-5xl",
            isPastMiddle ? "text-ado-primary-foreground" : "text-foreground",
          )}
        >
          A Voice Built Outside the Spotlight
        </h2>

        <p
          className={cn(
            "mt-4 max-w-3xl text-sm leading-relaxed transition-colors duration-700 md:text-justify md:text-lg",
            isPastMiddle
              ? "text-ado-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          Born in Tokyo in 2002, Ado began sharing song covers online as a
          teenager, uploading her performances to NicoNico. She emerged from
          Japan's utaite scene, a community of singers known for giving their
          own voice to songs originally created within VOCALOID culture. By
          consistently covering works from popular producers, she built
          recognition through vocal performance alone, establishing herself as
          an utaite before moving into mainstream releases.
        </p>

        <blockquote
          className={cn(
            "relative my-6 border-l-2 pl-4",
            isPastMiddle
              ? "border-ado-primary-foreground/50"
              : "border-ado-primary/50",
          )}
        >
          <p
            className={cn(
              "text-md font-gambarino italic transition-colors duration-700 md:text-xl",
              isPastMiddle
                ? "text-ado-primary-foreground/90"
                : "text-foreground/90",
            )}
          >
            Her major breakthrough came in 2020 with her debut song
          </p>
        </blockquote>

        <p
          className={cn(
            "max-w-3xl text-sm leading-relaxed transition-colors duration-700 md:text-justify md:text-lg",
            isPastMiddle
              ? "text-ado-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          <Highlight italic>Usseewa</Highlight>, a release that quickly pushed
          her beyond online recognition, marked a decisive turning point in her
          career. Its impact was followed by collaborations with some of Japan's
          most respected composers and lyricists with tracks like{" "}
          <Highlight italic>Odo</Highlight>,{" "}
          <Highlight italic>Gira Gira</Highlight>, and{" "}
          <Highlight italic>Yoru no Pierrot</Highlight>. These projects led to
          her debut album <Highlight italic>Kyōgen</Highlight> and her role as
          the singing voice of Uta in{" "}
          <Highlight italic>One Piece Film: Red</Highlight>
          {". "}
          The music from the film, including{" "}
          <Highlight italic>New Genesis</Highlight> introduced her voice to a
          much wider audience, carrying her beyond the boundaries of Japan and
          into a new phase of her career.
        </p>
      </div>
    </div>
  );
}

function AdoExtraInfo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPastMiddle = useContext(ThemeContext);

  useGSAP(
    () => {
      gsap.from(".ado-extra-content > *", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="flex items-stretch gap-6">
      <div className="ado-extra-content flex flex-col text-left">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              "h-px w-12 transition-colors duration-700",
              isPastMiddle
                ? "bg-ado-primary-foreground/70"
                : "bg-ado-primary/70",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium tracking-widest uppercase transition-colors duration-700 sm:text-sm",
              isPastMiddle
                ? "text-ado-primary-foreground/80"
                : "text-ado-primary",
            )}
          >
            The Phenomenon
          </span>
          <div
            className={cn(
              "h-px flex-1 transition-colors duration-700",
              isPastMiddle
                ? "bg-ado-primary-foreground/70"
                : "bg-ado-primary/70",
            )}
          />
        </div>

        <h2
          className={cn(
            "font-gambarino text-4xl leading-tight font-bold transition-colors duration-700 lg:text-5xl",
            isPastMiddle ? "text-ado-primary-foreground" : "text-foreground",
          )}
        >
          Beyond the Digital Stage
        </h2>
        <p
          className={cn(
            "mt-4 max-w-3xl text-sm leading-relaxed transition-colors duration-700 md:text-justify md:text-lg",
            isPastMiddle
              ? "text-ado-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          In recent years, Ado has centered her career around live performances,
          gradually expanding its scale and presence of her shows both in Japan
          and overseas. In 2024, she presented{" "}
          <Highlight>Ado SPECIAL LIVE 2024 "Shinzou (心臓)"</Highlight>, a
          two-day solo concert at Japan National Stadium, where she was the
          first female artist ever to perform at the venue. On{" "}
          <Highlight>Ado JAPAN LIVE TOUR 2024 "Profile of Mona Lisa"</Highlight>
          {", "}
          her performances adopted a more personal side of her live work,
          including the first onstage performance of her self-written song{" "}
          <Highlight italic>Shoka</Highlight>.
        </p>

        <p
          className={cn(
            "mt-4 max-w-3xl text-sm leading-relaxed transition-colors duration-700 md:text-justify md:text-lg",
            isPastMiddle
              ? "text-ado-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          Overseas, her reach expanded through world tours that steadily grew in
          scale. Her first world tour, <Highlight>Wish (ウィッシュ)</Highlight>{" "}
          in 2024, brought her music to audiences across Asia, Europe, and North
          America, with performances in cities from Bangkok to New York. In
          2025, Ado continued with <Highlight>Hibana (火花)</Highlight>, one of
          the largest world tours in history by a Japanese artist.
        </p>

        <p
          className={cn(
            "mt-4 max-w-3xl text-sm leading-relaxed transition-colors duration-700 md:text-justify md:text-lg",
            isPastMiddle
              ? "text-ado-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          In late 2025, following the success of her overseas tours, she
          returned to Japan for her first dome tour,{" "}
          <Highlight>Ado DOME TOUR 2025 "Yodaka (よだか)"</Highlight>
          {". "}
          The tour featured four large scale performances at Tokyo Dome and
          Kyocera Dome Osaka. Presented as a culmination of her fifth
          anniversary year, reflecting the momentum she built through Hibana and
          her growing presence on Japan's largest stages.
        </p>
      </div>
    </div>
  );
}

export function WhoIsAdo() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayOneRef = useRef<HTMLDivElement>(null);
  const [isPastMiddle, setIsPastMiddle] = useState(false);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setIsPastMiddle(self.progress >= 0.5),
      });

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
              end: "50% top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ThemeContext.Provider value={isPastMiddle}>
      <section
        id="who-is-ado"
        ref={sectionRef}
        className={cn(
          "relative transition-colors duration-700 ease-in-out",
          isPastMiddle ? "bg-ado-primary" : "bg-background",
        )}
      >
        <div className="mx-auto w-full max-w-none px-0">
          <div className="block lg:hidden">
            <div className="relative min-h-screen w-full">
              <div className="sticky top-0 min-h-screen">
                <Image
                  src={adoAvatar}
                  alt="Ado - Japanese singer and artist character"
                  aria-hidden="true"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <div
                ref={overlayOneRef}
                className="sticky top-0 z-10 h-screen w-full bg-background"
              >
                <div className="flex h-full w-full flex-col justify-center px-6">
                  <AdoDescription />
                </div>
              </div>

              <div
                className={cn(
                  "sticky top-0 z-20 h-screen w-full transition-colors duration-700",
                  isPastMiddle ? "bg-ado-primary" : "bg-background",
                )}
              >
                <div className="flex h-full w-full flex-col justify-center px-6">
                  <AdoExtraInfo />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative hidden py-24 transition-colors duration-700 lg:block",
              isPastMiddle ? "bg-ado-primary" : "bg-background",
            )}
          >
            <div className="mx-auto mb-10 grid max-w-9/12 grid-cols-2 items-center gap-10">
              <AdoDescription />
              <div className="relative aspect-3/4 overflow-hidden rounded-sm">
                <Image
                  src={adoAvatar}
                  alt="Ado - Japanese singer and artist character"
                  fill
                  priority
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mx-auto max-w-4xl">
              <AdoExtraInfo />
            </div>
          </div>
        </div>
      </section>
    </ThemeContext.Provider>
  );
}
