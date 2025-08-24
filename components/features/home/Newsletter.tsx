"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import rosesCrownSVG from "@/public/images/roses-crown.svg";

gsap.registerPlugin(ScrollTrigger);

export function NewsletterSection() {
  const rootRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listWrapperRef = useRef<HTMLUListElement>(null);

  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const headerDescRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const trigger = rootRef.current;
      if (!trigger) return;

      const listItems: HTMLElement[] = listWrapperRef.current
        ? (Array.from(listWrapperRef.current.children) as HTMLElement[])
        : [];

      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start: "top 70%",
            end: "bottom 15%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power2.out" },
        })
        .fromTo(
          iconRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
        )
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          "-=0.2",
        )
        .fromTo(
          descRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          "-=0.24",
        )
        .fromTo(
          listItems,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.08 },
          "-=0.2",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start: "top 60%",
            end: "bottom 35%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power2.out" },
        })
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.46 },
        )
        .fromTo(
          headerTitleRef.current,
          { autoAlpha: 0, y: 10, skewY: 2 },
          { autoAlpha: 1, y: 0, skewY: 0, duration: 0.32 },
          "-=0.3",
        )
        .fromTo(
          headerDescRef.current,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          "-=0.22",
        )
        .fromTo(
          buttonRef.current,
          { scale: 0.98, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(1.6)" },
          "-=0.18",
        );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden">
      <div className="relative z-10 container mx-auto grid min-h-3/4 grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2">
        <div className="text-left">
          <Image
            ref={iconRef}
            src={rosesCrownSVG}
            alt="Blue roses tribute to Ado"
            width={200}
            height={200}
            className="mb-4 h-auto w-50 will-change-transform"
            priority
          />

          <h2
            className="mb-3 font-gambarino text-4xl tracking-wide text-foreground uppercase will-change-transform md:text-5xl"
            ref={titleRef}
          >
            Newsletter
          </h2>

          <p
            ref={descRef}
            className="mb-5 max-w-prose text-sm leading-relaxed text-muted-foreground will-change-transform md:text-base"
          >
            Get official updates on releases, tours, and special projects —
            directly from Ado&apos;s team.
          </p>
          <ul
            ref={listWrapperRef}
            className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground/90 sm:gap-2 sm:text-sm"
          >
            <li className="rounded-md border border-foreground/10 bg-card/40 p-2 sm:p-3">
              • Early announcements
            </li>
            <li className="rounded-md border border-foreground/10 bg-card/40 p-2 sm:p-3">
              • Tour & event alerts
            </li>
            <li className="rounded-md border border-foreground/10 bg-card/40 p-2 sm:p-3">
              • Official merch drops
            </li>
            <li className="rounded-md border border-foreground/10 bg-card/40 p-2 sm:p-3">
              • Behind-the-scenes notes
            </li>
          </ul>
        </div>

        <Card
          ref={cardRef}
          className="mx-auto w-full max-w-md rounded-lg border border-foreground/10 bg-card/40 will-change-transform"
          aria-label="Subscribe card"
        >
          <CardHeader>
            <CardTitle
              ref={headerTitleRef}
              className="font-gambarino text-xl font-semibold tracking-wide text-foreground sm:text-2xl"
            >
              Subscribe to Ado&apos;s Newsletter
            </CardTitle>
            <CardDescription
              ref={headerDescRef}
              className="text-sm text-muted-foreground"
            >
              Be the first to know about new music, live events, and exclusive
              updates. Redirects to the official signup page managed by
              Ado&apos;s team.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link
              href="https://umusic.jp/ado_nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                ref={buttonRef}
                className="w-full cursor-grab bg-ado-secondary text-base text-white hover:bg-ado-key/70"
              >
                Subscribe
                <ExternalLink />
              </Button>
            </Link>

            <p className="mt-6 text-xs text-muted-foreground">
              Powered by{" "}
              <span className="rounded bg-ado-key/20 px-1 py-1 font-medium text-ado-key">
                umusic.jp
              </span>
              {", "} we never collect your email here.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
