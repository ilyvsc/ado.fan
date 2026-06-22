"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { RosesCrown } from "@/components/icons/RosesCrown";

gsap.registerPlugin(ScrollTrigger);

export function TracedRosesCrown({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const container = ref.current;
      if (!container) return;

      const paths = Array.from(container.querySelectorAll("path"));
      if (!paths.length) return;

      gsap.set(paths, {
        fillOpacity: 0,
        stroke: "currentColor",
        strokeWidth: 4,
        strokeOpacity: 1,
        strokeDasharray: (_, el) => (el as SVGPathElement).getTotalLength(),
        strokeDashoffset: (_, el) => (el as SVGPathElement).getTotalLength(),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.12,
        ease: "power2.inOut",
      }).to(
        paths,
        { fillOpacity: 1, strokeOpacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(paths, { clearProps: "all" });
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-flex">
      <RosesCrown className={className} />
    </span>
  );
}
