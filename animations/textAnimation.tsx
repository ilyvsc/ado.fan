import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function useTextAnimate(
  heading: React.RefObject<HTMLElement | null>,
  text: React.RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      if (!heading.current || !text.current) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: heading.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(heading.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.8,
      }).from(
        text.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
        },
        "-=0.4",
      );
    },
    { dependencies: [heading, text] },
  );
}
