import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { RefObject } from "react";

interface UseTextAnimateOptions {
  // ScrollTrigger options
  trigger?: Element | string;
  start?: string;
  end?: string;
  toggleActions?: string;

  // Animation options
  distance?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  disabled?: boolean;
}

export function useTextAnimate(
  heading: RefObject<HTMLElement | null>,
  text: RefObject<HTMLElement | null>,
  options: UseTextAnimateOptions = {},
) {
  const {
    trigger,
    start = "top 80%",
    end = "bottom 20%",
    toggleActions = "play none none reverse",
    distance = 30,
    duration = 0.8,
    ease = "power2.out",
    stagger = 0,
    disabled = false,
  } = options;

  useGSAP(
    () => {
      if (disabled || !heading.current || !text.current) return;

      const textAnimation = {
        opacity: 0,
        y: distance,
        duration: duration * 0.75,
      };

      const tl = gsap.timeline({
        defaults: { ease },
        scrollTrigger: {
          trigger: trigger || heading.current,
          start,
          end,
          toggleActions,
        },
      });

      tl.from(heading.current, {
        opacity: 0,
        y: distance,
        scale: 0.95,
        duration,
      });

      if (stagger > 0) {
        if (text.current.children.length > 0) {
          tl.from(
            Array.from(text.current.children),
            {
              ...textAnimation,
              stagger,
            },
            "-=0.4",
          );
        } else {
          tl.from(text.current, textAnimation, "-=0.4");
        }
      } else {
        tl.from(text.current, textAnimation, "-=0.4");
      }
    },
    { dependencies: [heading, text, disabled] },
  );
}
