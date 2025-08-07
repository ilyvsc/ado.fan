import { gsap } from "gsap";

import { useEffect } from "react";

export function useTextAnimate(
  heading: React.RefObject<HTMLElement | null>,
  text: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!heading.current || !text.current) return;

    gsap.set([heading.current, text.current], {
      opacity: 0,
      y: 30,
    });
    gsap.set(heading.current, { scale: 0.95 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heading.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(heading.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    }).to(
      text.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    );

    return () => {
      tl.kill();
    };
  }, [heading, text]);
}
