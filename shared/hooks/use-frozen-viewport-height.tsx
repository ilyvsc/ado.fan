import { useLayoutEffect } from "react";

import type { RefObject } from "react";

/**
 * Sets an element's height in px once, from `window.innerHeight` at mount.
 * Devtools docking and window resize change the viewport (and thus `dvh`/`vh` units)
 * which un-pins GSAP ScrollTrigger sections mid-scroll
 */
export function useFrozenViewportHeight(
  ref: RefObject<HTMLElement | null>,
  minWidth = 0,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.innerWidth < minWidth) return;
    el.style.height = `${window.innerHeight}px`;
  }, [ref, minWidth]);
}
