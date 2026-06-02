"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { linksCategories } from "@/lib/socialLinks";

import VivariumInterview from "@/public/images/vivarium_interview.png";

const socialLinks = linksCategories["social-media"] ?? [];

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const navigationLinks = [
  { label: "The Artist", href: "#who-is-ado" },
  { label: "Community", href: "#connect" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Lyrics Finder", href: "/lyrics" },
];

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          delay: 0.3,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        })
        .fromTo(
          ".hero-title",
          { opacity: 0, y: -30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
        )
        .fromTo(
          ".hero-rule",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.6",
        )
        .fromTo(
          ".hero-fade",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.4",
        );
    },
    { scope: wrapperRef },
  );

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 0 },
          ease: "power3.inOut",
        });
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-svh w-full overflow-hidden bg-black lg:h-screen"
    >
      <div className="hero-bg pointer-events-none absolute inset-0 z-0">
        <Image
          src={VivariumInterview}
          alt="Ado in Vivarium - first live action music video"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-between pt-40 pb-20 md:pt-44 md:pb-20">
        <div className="flex flex-col items-center px-6 text-center">
          <h1
            className="hero-title font-serif leading-none tracking-tight text-white italic opacity-0"
            style={{ fontSize: "clamp(12rem, 22vw, 18rem)" }}
          >
            Ado
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 px-6">
          <div className="flex w-full max-w-lg items-center gap-3">
            <div className="hero-rule h-px flex-1 origin-right bg-linear-to-r from-transparent to-white/25" />
            <p className="hero-fade shrink-0 font-serif text-sm tracking-widest text-white/50 uppercase opacity-0">
              The voice behind the mask
            </p>
            <div className="hero-rule h-px flex-1 origin-left bg-linear-to-l from-transparent to-white/25" />
          </div>

          <div className="hero-fade flex flex-col items-center gap-2 opacity-0">
            <p className="font-serif text-base text-white/60 italic md:text-lg">
              First ever live-action music video -{" "}
              <span className="text-white/85">Vivarium</span>
            </p>
          </div>

          <nav className="hero-fade flex flex-col items-center gap-5 opacity-0">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-10">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, link.href);
                  }}
                  className="group relative font-serif text-sm tracking-wide text-white/60 transition-colors duration-300 hover:text-white sm:text-base"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-white/40 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.description}
                  className="text-white/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-white/80"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
