"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Plus } from "lucide-react";

import Link from "next/link";
import { useRef, useState } from "react";

import { getAssetUrl, Image } from "@/components/ui/image";
import { categories } from "@/lib/socialLinks";
import { cn } from "@/shared/lib/utils";

import { SocialIcons } from "../ui/SocialIcons";

gsap.registerPlugin(ScrollTrigger);

const dokiDokiUrl =
  categories
    .flatMap((category) => category.data)
    .find((link) => link.name === "Doki Doki Secret Base")?.url ?? "#";

export function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.fromTo(
        "[data-connect-header]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        0,
      ).fromTo(
        "[data-connect-row]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: "power3.out" },
        0.4,
      );

      gsap.fromTo(
        "[data-connect-doki]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-connect-doki]",
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-connect-panel]").forEach((panel) => {
        const isOpen = panel.dataset.connectPanel === openId;

        gsap.to(panel, {
          height: isOpen ? "auto" : 0,
          autoAlpha: isOpen ? 1 : 0,
          duration: 0.55,
          ease: "power3.inOut",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [openId] },
  );

  return (
    <section
      id="connect"
      ref={sectionRef}
      className="relative overflow-hidden bg-ado-secondary/15 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="flex items-end justify-between gap-10">
          <div>
            <h2
              data-connect-header
              className="font-serif text-4xl leading-tight font-bold text-foreground md:text-6xl"
            >
              Find Ado everywhere
            </h2>
            <p
              data-connect-header
              className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg"
            >
              She performs anonymously, so these verified channels are her entire
              public presence: her own accounts, her label and shops, the platforms
              that stream her catalog, and the places where fans gather.
            </p>
          </div>
          <Image
            data-connect-header
            src={getAssetUrl(
              "others/dokidoki-secret-club/ado-dokidoki-character.webp",
            )}
            alt="Ado's chibi character from the Doki Doki Secret Base"
            width={480}
            height={480}
            className="hidden h-36 w-auto shrink-0 md:block lg:h-44"
          />
        </div>

        <div className="mt-10 flex flex-col md:mt-14">
          {categories.map((category) => {
            const isOpen = openId === category.id;

            return (
              <div key={category.id} data-connect-row>
                <button
                  onClick={() => {
                    setOpenId(isOpen ? null : category.id);
                  }}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-4 text-left md:py-5"
                >
                  <span className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "font-serif text-2xl leading-tight font-bold transition-colors duration-300 sm:text-3xl md:text-4xl",
                        isOpen
                          ? "text-foreground"
                          : "text-foreground/55 group-hover:text-foreground",
                      )}
                    >
                      {category.label}
                    </span>
                    <span
                      className={cn(
                        "max-w-3xl text-sm leading-relaxed transition-colors duration-300 md:text-base",
                        isOpen
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60 group-hover:text-muted-foreground",
                      )}
                    >
                      {category.description}
                    </span>
                  </span>
                  <Plus
                    className={cn(
                      "size-6 shrink-0 transition-transform duration-300 md:size-7",
                      isOpen
                        ? "rotate-45 text-foreground"
                        : "text-foreground/35 group-hover:text-foreground",
                    )}
                  />
                </button>

                <div
                  data-connect-panel={category.id}
                  className="h-0 overflow-hidden opacity-0"
                >
                  <div className="pt-2 pb-9">
                    <SocialIcons links={category.data} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-3">
          <div data-connect-doki>
            <h3 className="font-serif text-2xl leading-tight font-bold text-foreground md:text-3xl">
              She even has a secret base
            </h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">
              Doki Doki Secret Base is Ado's membership fan club: exclusive vlogs,
              tour diaries, broadcasts, and member-only stories inside a pixel-art
              hideout.
            </p>
            <Link
              href={dokiDokiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 text-base font-medium text-ado-primary"
            >
              <span className="relative">
                Enter the club
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-ado-primary transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <div data-connect-doki className="shrink-0">
            <Image
              src={getAssetUrl(
                "others/dokidoki-secret-club/ado-dokidoki-background-mobile-text",
              )}
              alt="Doki Doki Secret Base pixel-art"
              width={480}
              height={640}
              className="h-auto w-auto md:hidden"
            />
            <Image
              src={getAssetUrl("others/dokidoki-secret-club/ado-dokidoki-background")}
              alt="Doki Doki Secret Base pixel-art"
              width={640}
              height={480}
              className="hidden md:block md:h-60 md:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
