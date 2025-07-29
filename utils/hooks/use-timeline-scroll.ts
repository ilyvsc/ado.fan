import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimelineScrollProps {
  stepsLength: number;
  isMobile?: boolean;
}

interface UseTimelineScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentIndex: number;
  scrollToStep: (stepIndex: number) => void;
}

export function useTimelineScroll({
  stepsLength,
  isMobile = false,
}: UseTimelineScrollProps): UseTimelineScrollReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (isMobile) {
      // Horizontal scrolling for mobile
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const itemWidth = containerWidth;

      const newIndex = Math.round(scrollLeft / itemWidth);
      const clampedIndex = Math.max(0, Math.min(newIndex, stepsLength - 1));

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }
    } else {
      // Vertical scrolling for desktop
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemHeight = containerHeight;

      const newIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(newIndex, stepsLength - 1));

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }
    }
  }, [stepsLength, currentIndex, isMobile]);

  const throttledHandleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      handleScroll();
    }, 16); // ~60fps
  }, [handleScroll]);

  const scrollToStep = useCallback(
    (stepIndex: number) => {
      if (!containerRef.current) return;

      const container = containerRef.current;

      if (isMobile) {
        // Horizontal scrolling for mobile
        const containerWidth = container.clientWidth;
        container.scrollTo({
          left: stepIndex * containerWidth,
          behavior: "smooth",
        });
      } else {
        // Vertical scrolling for desktop
        const containerHeight = container.clientHeight;
        container.scrollTo({
          top: stepIndex * containerHeight,
          behavior: "smooth",
        });
      }
    },
    [isMobile],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", throttledHandleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [throttledHandleScroll]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    currentIndex,
    scrollToStep,
  };
}
