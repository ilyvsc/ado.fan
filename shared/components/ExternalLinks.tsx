"use client";

import { useGSAP } from "@gsap/react";
import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import gsap from "gsap";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { useCallback, useMemo, useRef, useState } from "react";

import { NicoNicoPlayer, YouTubePlayer } from "@/shared/components/VideoPlayer";
import type { ExternalLinkDefinition } from "@/types/externalLink";

function ExternalLinkItem({
  link,
  isOpen,
  onToggle,
}: {
  link: ExternalLinkDefinition;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);

  const isYouTube = link.type === "youtubeVideo";
  const isNico = link.type === "nicoVideo";
  const isVideo = isYouTube || isNico;

  useGSAP(
    () => {
      if (!contentRef.current) return;

      const ctx = gsap.context(() => {
        gsap.to(contentRef.current!, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }, contentRef);

      return () => ctx.revert();
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
      className={`border-b border-foreground/10 transition-colors duration-300 last:border-b-0 ${
        isOpen ? "bg-foreground/5" : "hover:bg-foreground/10"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="group w-full px-2 py-3 text-left transition-all duration-300 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              {isYouTube && (
                <SiYoutube
                  className={`h-4 w-4 transition-all duration-300 ${
                    isOpen
                      ? "text-foreground/80"
                      : "text-foreground/50 group-hover:text-foreground/70"
                  }`}
                />
              )}

              {isNico && (
                <SiNiconico
                  className={`h-4 w-4 transition-all duration-300 ${
                    isOpen
                      ? "text-foreground/80"
                      : "text-foreground/50 group-hover:text-foreground/70"
                  }`}
                />
              )}

              {!isVideo && (
                <ArrowUpRight
                  className={`h-5 w-5 transition-all duration-300 ${
                    isOpen
                      ? "text-foreground/60"
                      : "text-foreground/30 group-hover:text-foreground/50"
                  }`}
                />
              )}
            </div>

            <span
              className={`truncate text-xs font-medium transition-all duration-300 sm:text-sm ${
                isOpen
                  ? "text-foreground"
                  : "text-foreground/80 group-hover:text-foreground"
              }`}
            >
              {title}
            </span>
          </div>

          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-foreground/50"
                : "text-foreground/30 group-hover:text-foreground/40"
            }`}
          />
        </div>
      </button>

      <div ref={contentRef} className="h-0 overflow-hidden opacity-0">
        <div className="space-y-3 px-3 pb-3 pl-8 sm:px-4 sm:pl-9">
          {isVideo && hasOpened && (
            <div className="aspect-video overflow-hidden border border-foreground/5 bg-foreground/10 transition-colors duration-300 hover:border-foreground/10">
              {isYouTube ? (
                <YouTubePlayer
                  youtubeId={link.value}
                  title={link.title ?? undefined}
                />
              ) : (
                <NicoNicoPlayer
                  nicoId={link.value}
                  title={link.title ?? undefined}
                />
              )}
            </div>
          )}

          {link.description && (
            <p className="text-sm leading-relaxed text-balance text-foreground">
              {link.description}
            </p>
          )}

          {!isVideo && (
            <a
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-foreground/60 underline underline-offset-2 transition-all duration-300 hover:text-foreground/80 hover:underline-offset-3"
            >
              {link.value}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExternalLinks({ links }: { links: ExternalLinkDefinition[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  if (!links?.length) return null;

  return (
    <div className="mb-8 w-full space-y-2 py-4">
      <h3 className="font-gambarino text-lg font-bold tracking-wide text-foreground">
        Related Links
      </h3>

      <div className="w-full divide-y divide-foreground/10 border-y border-foreground/10">
        {links.map((link, i) => (
          <ExternalLinkItem
            key={`${link.type}-${link.value}`}
            link={link}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}
