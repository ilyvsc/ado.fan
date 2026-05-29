import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

const PAGE_SIZE = 24;

export function useDisplayPagination<T>(items: T[], pageSize = PAGE_SIZE) {
  const isMobile = useIsMobile();
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [prevItems, setPrevItems] = useState(items);

  if (prevItems !== items) {
    setPrevItems(items);
    setVisibleCount(pageSize);
  }

  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  useEffect(() => {
    if (!hasMore) observerRef.current?.disconnect();
  }, [hasMore]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const setupObserver = useCallback(
    (element: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!element || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setVisibleCount((c) => c + pageSize);
          }
        },
        { rootMargin: isMobile ? "150px" : "400px", threshold: 0.1 },
      );
      observerRef.current.observe(element);
    },
    [hasMore, pageSize, isMobile],
  );

  const showAll = useCallback(() => {
    setVisibleCount(items.length);
  }, [items.length]);

  return { visible, hasMore, setupObserver, showAll };
}
