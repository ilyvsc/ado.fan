"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRightSquare,
  Bell,
  Calendar,
  ShoppingBag,
  Video,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import rosesCrownSVG from "@/public/images/roses-crown.svg";
import { RosesCrown } from "@/shared/components/icons/RosesCrown";

gsap.registerPlugin(ScrollTrigger);

const newsletterBenefits = [
  { label: "Early release announcements", Icon: Bell },
  { label: "Tour dates & live event alerts", Icon: Calendar },
  { label: "Official merchandise drops", Icon: ShoppingBag },
  { label: "Behind-the-scenes insights", Icon: Video },
];

export function NewsletterSection() {
  const rootRef = useRef<HTMLElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const marqueeViewportRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  const benefits = useMemo(
    () => [...newsletterBenefits, ...newsletterBenefits],
    [],
  );

  useGSAP(
    () => {
      const trigger = rootRef.current;
      const track = marqueeTrackRef.current;
      if (!trigger || !track) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power2.out" },
      });

      tl.fromTo(
        iconRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
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
          marqueeViewportRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 },
          "-=0.1",
        )
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, x: 32 },
          { autoAlpha: 1, x: 0, duration: 0.55 },
          "-=0.5",
        );

      let singleWidth = track.scrollWidth / 2;

      const marqueeTween = gsap.to(track, {
        x: -singleWidth,
        duration: 18,
        ease: "none",
        repeat: -1,
        paused: true,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % singleWidth),
        },
      });

      ScrollTrigger.create({
        trigger,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => marqueeTween.play(),
        onEnterBack: () => marqueeTween.play(),
        onLeave: () => marqueeTween.pause(),
        onLeaveBack: () => marqueeTween.pause(),
      });
      return () => marqueeTween.kill();
    },
    { scope: rootRef },
  );

  return (
    <section
      id="newsletter"
      ref={rootRef}
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-between bg-background px-6 py-12 md:px-12">
          <div className="flex flex-col items-start">
            <RosesCrown
              ref={iconRef}
              className="mb-2 h-20 w-auto text-ado-secondary md:h-24"
            />
            <h2
              ref={titleRef}
              className="font-gambarino text-5xl leading-tight tracking-wide text-foreground uppercase md:text-6xl"
            >
              Newsletter
            </h2>
            <p
              ref={descRef}
              className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Keep up with official news and updates. Be the first to hear about
              new music, upcoming live shows, tour dates, and special
              announcements as they're released.
            </p>
          </div>

          <div
            ref={marqueeViewportRef}
            className="mt-6 overflow-hidden border-t border-foreground/10 pt-4"
          >
            <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground/50 uppercase">
              What you'll receive
            </p>

            <div ref={marqueeTrackRef} className="flex w-max gap-6">
              {benefits.map(({ label, Icon }, i) => (
                <span
                  key={`${i}-${label}`}
                  className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground"
                  aria-hidden={i >= newsletterBenefits.length}
                >
                  <Icon className="size-4 shrink-0 text-ado-primary/60" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={cardRef}
          className="relative flex flex-col justify-center gap-4 overflow-hidden bg-ado-primary px-8 py-12"
          aria-labelledby="newsletter"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-gambarino text-3xl tracking-wide text-ado-primary-foreground sm:text-4xl">
              Ado's Newsletter
            </h3>
            <p className="text-sm leading-relaxed text-ado-primary-foreground/80 md:text-base">
              Subscription takes place exclusively on the official page. This
              website never collects or has access to your email or personal
              information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-ado-primary-foreground/20" />
            <span aria-hidden="true" className="text-ado-primary-foreground/40">
              ✦
            </span>
            <div className="h-px flex-1 bg-ado-primary-foreground/20" />
          </div>

          <Link
            href="https://umusic.jp/ado_nl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="group w-full bg-ado-primary-foreground py-5 text-base font-semibold tracking-wide text-ado-primary transition-colors duration-200 hover:bg-ado-primary-foreground/90">
              Subscribe
              <ArrowUpRightSquare />
            </Button>
          </Link>

          <p className="text-center text-xs text-ado-primary-foreground/80 md:text-sm">
            via{" "}
            <span className="font-medium text-ado-primary-foreground">
              umusic.jp
            </span>{" "}
            Ado's official newsletter platform
          </p>
        </div>
      </div>
    </section>
  );
}
