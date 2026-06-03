"use client";

import { useGSAP } from "@gsap/react";
import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import gsap from "gsap";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { useCallback, useId, useMemo, useRef, useState } from "react";

import { NicoNicoPlayer, YouTubePlayer } from "@/shared/components/VideoPlayer";

import type { ExternalLinks } from "@/shared/schemas/externalLinks";

function ExternalLinkItem({
  link,
  isOpen,
  onToggle,
}: {
  link: ExternalLinks[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const [hasOpened, setHasOpened] = useState(false);

  const isYouTube = link.type === "youtubeVideo";
  const isNico = link.type === "nicoVideo";
  const isVideo = isYouTube || isNico;

  useGSAP(
    () => {
      if (!contentRef.current) return;

      const ctx = gsap.context(() => {
        gsap.to(contentRef.current, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }, contentRef);

      return () => {
        ctx.revert();
      };
    },
    { dependencies: [isOpen] },
  );

  const title = useMemo(() => {
    if (link.title) return link.title;
    if (isYouTube) return "YouTube";
    if (isNico) return "NicoNico";
    return "Link";
  }, [link.title, isYouTube, isNico]);

  const handleToggle = () => {
    if (!hasOpened && !isOpen) {
      setHasOpened(true);
    }
    onToggle();
  };

  return (
    <div
      className={`border-b border-(--theme-contrast)/15 transition-colors duration-300 last:border-b-0 ${
        isOpen ? "bg-(--theme-contrast)/8" : "hover:bg-(--theme-contrast)/10"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full px-2 py-3.5 text-left transition-all duration-300 focus-visible:bg-(--theme-contrast)/10 focus-visible:outline-2 focus-visible:outline-(--theme-contrast)/50 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              {isYouTube && (
                <SiYoutube
                  aria-hidden="true"
                  className={`h-4 w-4 transition-all duration-300 ${
                    isOpen
                      ? "text-(--theme-contrast)/90"
                      : "text-(--theme-contrast)/70 group-hover:text-(--theme-contrast)/90"
                  }`}
                />
              )}

              {isNico && (
                <SiNiconico
                  aria-hidden="true"
                  className={`h-4 w-4 transition-all duration-300 ${
                    isOpen
                      ? "text-(--theme-contrast)/90"
                      : "text-(--theme-contrast)/70 group-hover:text-(--theme-contrast)/90"
                  }`}
                />
              )}

              {!isVideo && (
                <ArrowUpRight
                  aria-hidden="true"
                  className={`h-5 w-5 transition-all duration-300 ${
                    isOpen
                      ? "text-(--theme-contrast)/80"
                      : "text-(--theme-contrast)/65 group-hover:text-(--theme-contrast)/80"
                  }`}
                />
              )}
            </div>

            <span
              className={`truncate text-sm font-medium transition-all duration-300 ${
                isOpen
                  ? "text-(--theme-contrast)"
                  : "text-(--theme-contrast)/90 group-hover:text-(--theme-contrast)"
              }`}
            >
              {title}
            </span>
          </div>

          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-(--theme-contrast)/75"
                : "text-(--theme-contrast)/65 group-hover:text-(--theme-contrast)/80"
            }`}
          />
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-label={title}
        ref={contentRef}
        className="h-0 overflow-hidden opacity-0"
      >
        <div className="space-y-3 px-3 pb-3 pl-8 sm:px-4 sm:pl-9">
          {isVideo && hasOpened && (
            <div className="aspect-video overflow-hidden border border-(--theme-contrast)/10 bg-(--theme-contrast)/10 transition-colors duration-300 hover:border-(--theme-contrast)/20">
              {isYouTube ? (
                <YouTubePlayer
                  youtubeId={link.value}
                  title={link.title ?? undefined}
                />
              ) : (
                <NicoNicoPlayer nicoId={link.value} title={link.title ?? undefined} />
              )}
            </div>
          )}

          {link.description && (
            <p className="text-sm leading-relaxed text-balance text-(--theme-contrast)">
              {link.description}
            </p>
          )}

          {!isVideo && (
            <a
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-(--theme-contrast)/80 underline underline-offset-2 transition-all duration-300 hover:text-(--theme-contrast) hover:underline-offset-3 focus-visible:text-(--theme-contrast) focus-visible:outline-none"
            >
              {link.value}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExternalLinks({ links }: { links: ExternalLinks }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  if (!links.length) return null;

  return (
    <section
      aria-labelledby="related-links-heading"
      className="mb-8 w-full space-y-2 py-4"
    >
      <h3
        id="related-links-heading"
        className="font-serif text-base font-bold tracking-wide text-(--theme-contrast) sm:text-lg"
      >
        Related Links
      </h3>

      <div className="w-full divide-y divide-(--theme-contrast)/15 border-y border-(--theme-contrast)/15">
        {links.map((link, i) => (
          <ExternalLinkItem
            key={`${link.type}-${link.value}`}
            link={link}
            isOpen={openIndex === i}
            onToggle={() => {
              handleToggle(i);
            }}
          />
        ))}
      </div>
    </section>
  );
}
