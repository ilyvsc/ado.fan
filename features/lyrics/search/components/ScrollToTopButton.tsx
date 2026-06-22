"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronUp } from "lucide-react";

import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollToPlugin);

export function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        gsap.to(window, {
          scrollTo: { y: 0, autoKill: false },
          duration: prefersReduced ? 0 : 0.6,
          ease: "power3.out",
        });
      }}
      aria-label="Scroll to top"
      className="fixed right-6 bottom-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-foreground/15 hover:text-foreground"
    >
      <ChevronUp className="h-4 w-4" />
    </button>
  );
}
