"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { useRef } from "react";

import adoAvatar from "@/public/images/ado-avatar.jpg";

gsap.registerPlugin(ScrollTrigger);

function AdoDescription() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex items-stretch gap-6">
      <div className="ado-desc-content flex flex-col text-left">
        <span className="mb-2 text-xs font-medium tracking-widest text-muted-foreground/80 uppercase sm:text-sm">
          The Artist
        </span>
        <h2 className="font-gambarino text-4xl leading-tight font-bold lg:text-5xl">
          A Voice Built Outside the Spotlight
        </h2>
        <p className="sm:text-md mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-lg">
          Born in Tokyo in 2002, Ado started sharing song covers online as a
          teenager, uploading her performances to NicoNico (ニコニコ動画). Here,
          she was heavily influenced by VOCALOID culture, shapping her early
          musical taste. She covered songs by popular VOCALOID producers,
          gradually attracting attention within that community and establishing
          herself as an utaite.
        </p>

        <p className="sm:text-md mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-lg">
          Her major breakthrough came in 2020 with her debut song{" "}
          <span className="font-bold italic">Usseewa</span>, a release that
          quickly pushed her beyond online recognition. This was followed by
          collaborations with some of Japan's most respected composers and
          lyricists with tracks like{" "}
          <span className="font-bold italic">Odo</span>
          {", "}
          <span className="font-bold italic">Gira Gira</span>
          {", and "}
          <span className="font-bold italic">Yoru no Pierrot</span>
          {". "}
          These projects led to her debut album{" "}
          <span className="font-bold italic">Kyōgen</span> and her role as the
          singing voice of Uta in{" "}
          <span className="font-bold italic">One Piece Film: Red</span>,
          including the worldwide hit{" "}
          <span className="font-bold italic">New Genesis</span> marking a clear
          expansion on her career.
        </p>
      </div>
    </div>
  );
}

function AdoExtraInfo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex items-stretch gap-6">
      <div className="ado-extra-content flex flex-col text-left">
        <span className="mb-2 text-xs font-medium tracking-widest text-muted-foreground/80 uppercase sm:text-sm">
          The Phenomenon
        </span>
        <h2 className="font-gambarino text-4xl leading-tight font-bold lg:text-5xl">
          Beyond the Digital Stage
        </h2>
        <p className="sm:text-md mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-lg">
          In recent years, Ado has performed widely in Japan and overseas,
          gradually building a strong live presence through consistent,
          well-received concerts. In 2024, she presented{" "}
          <span>Ado SPECIAL LIVE 2024 Shinzou (心臓)</span>, a two-day solo
          concert at Japan National Stadium that reflected her growing
          confidence on larger stages. In late 2025, she reached another
          milestone with dome performances at Tokyo Dome and Kyocera Dome Osaka,
          as part of <span>Ado DOME TOUR 2025 (よだか)</span>.
        </p>

        <p className="sm:text-md mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-lg">
          Overseas, her reach expanded through world tours that steadily grew in
          scale. Her first world tour, <span>Wish (ウィッシュ)</span> in 2024,
          brought her music to audiences across Asia, Europe, and North America,
          with performances in cities from Bangkok to New York. In 2025, Ado
          continued with <span>Hibana (火花)</span>, performing in more than 30
          cities worldwide and reaching countries she hadn't visited during
          Wish, while presenting a more developed stage production and setlist
          that reflected her artistic growth. Ado described Hibana as her way of
          lighting a bigger spark in the world and building on the connections
          she made during Wish.
        </p>
      </div>
    </div>
  );
}

export function WhoIsAdo() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayOneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (imageRef.current) {
        gsap.set(imageRef.current, {
          willChange: "transform, opacity",
        });

        gsap.from(imageRef.current, {
          opacity: 0,
          xPercent: -10,
          duration: 1.4,
          ease: "power3.out",
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
    },
    { scope: sectionRef },
  );

  return (
    <section id="who-is-ado" ref={sectionRef} className="relative lg:py-14">
      <div className="mx-auto w-full max-w-none px-0">
        <div className="block lg:hidden">
          <div className="relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen w-full">
              <Image
                src={adoAvatar}
                alt="Ado - Japanese singer and artist character"
                aria-hidden="true"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div
              ref={overlayOneRef}
              className="sticky top-0 z-10 h-screen w-full bg-background"
            >
              <div className="flex h-full w-full flex-col justify-between px-6 pt-24 pb-12 sm:px-8 sm:pt-28 sm:pb-16 md:px-12">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-foreground/30" />
                  <span className="text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">
                    01
                  </span>
                </div>
                <div className="w-full max-w-2xl">
                  <AdoDescription />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-px bg-foreground/20" />
                  <span className="text-xs tracking-wider text-muted-foreground/60 uppercase">
                    Keep Scrolling
                  </span>
                </div>
              </div>
            </div>

            <div className="sticky top-0 z-20 h-screen w-full bg-background">
              <div className="flex h-full w-full flex-col justify-between px-6 pt-24 pb-12 sm:px-8 sm:pt-28 sm:pb-16 md:px-12">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-foreground/30" />
                  <span className="text-xs font-medium tracking-widest text-muted-foreground/50 uppercase">
                    02
                  </span>
                </div>
                <div className="w-full max-w-2xl">
                  <AdoExtraInfo />
                </div>
                <div className="flex items-center gap-3 opacity-0">
                  <div className="h-6 w-px bg-foreground/20" />
                  <span className="text-xs tracking-wider text-muted-foreground/40 uppercase">
                    End
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="flex min-h-screen">
            <div className="relative z-10 flex w-1/2 flex-col justify-center py-18 md:p-16">
              <div className="relative">
                <AdoDescription />
              </div>

              <div className="mt-18">
                <AdoExtraInfo />
              </div>
            </div>

            <div className="relative w-1/2">
              <div
                ref={imageRef}
                className="sticky top-0 h-screen w-full overflow-hidden"
              >
                <div className="absolute inset-0 z-10 bg-linear-to-r from-background via-background/5 to-transparent" />
                <Image
                  src={adoAvatar}
                  alt="Ado - Japanese singer and artist character"
                  aria-hidden="true"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
