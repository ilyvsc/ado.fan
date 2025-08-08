"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

type AnimationConfig = {
  text?: string;
  rows?: number;
  speed?: number;
  direction?: "left" | "right";
  font?: {
    family?: string;
    size?: string;
    weight?: string | number;
  };
  stroke?: {
    width?: string;
    color?: string;
  };
  className?: string;
  children?: React.ReactNode;
};

export function InfiniteTextAnimation({
  text = "text",
  rows = 1,
  speed = 5,
  direction = "left",
  font = {
    family: "",
    size: "clamp(3rem, 12vw, 7.5rem)",
    weight: 800,
  },
  stroke = {
    width: "2px",
    color: "#FFFFFF",
  },
  className,
  children,
}: Readonly<AnimationConfig>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  rowRefs.current = [];

  const dir = direction === "left" ? -1 : 1;
  const safeRows = Math.max(1, Math.floor(rows));
  const safeSpeed = Math.max(0.1, Number.isFinite(speed) ? speed : 1);
  const [repeats, setRepeats] = useState(6); // even, >= 4

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rowKeys = useMemo(
    () =>
      Array.from(
        { length: safeRows },
        (_, i) => `row-${i}-${direction}-${text}`,
      ),
    [safeRows, direction, text],
  );

  const measure = () => {
    const container = containerRef.current;
    const firstRow = rowRefs.current[0];
    const firstCell = firstRow?.firstElementChild as HTMLElement | null;

    if (!container || !firstRow || !firstCell) return { ok: false as const };

    const itemWidth = Math.max(1, firstCell.offsetWidth || 0);
    const containerWidth = Math.max(0, container.offsetWidth || 0);

    // Need enough cells to cover 2x container width so wrap feels continuous
    let needed = Math.ceil((containerWidth * 2) / itemWidth) + 2;
    if (needed < 4) needed = 4;
    if (needed % 2 !== 0) needed += 1; // ensure even

    const cycleWidth = itemWidth * (needed / 2);
    return { ok: true as const, needed, cycleWidth };
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      const m = measure();
      if (!m.ok) return;
      if (m.needed !== repeats) setRepeats(m.needed);
    });

    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const m = measure();
      if (!m.ok) return;
      const { cycleWidth } = m;

      gsap.killTweensOf(rowRefs.current);

      rowRefs.current.slice(0, safeRows).forEach((rowEl) => {
        if (!rowEl) return;
        gsap.set(rowEl, { x: dir === -1 ? 0 : -cycleWidth });

        const wrapX = gsap.utils.wrap(-cycleWidth, 0);

        gsap.to(rowEl, {
          x: dir === -1 ? `-=${cycleWidth}` : `+=${cycleWidth}`,
          duration: safeSpeed * 10,
          ease: "none",
          repeat: -1,
          modifiers: { x: gsap.utils.unitize(wrapX) },
        });
      });
    },
    {
      scope: containerRef,
      dependencies: [
        safeRows,
        safeSpeed,
        dir,
        text,
        direction,
        repeats,
        font?.family,
        font?.size,
        font?.weight,
        stroke?.width,
        stroke?.color,
      ],
      revertOnUpdate: true,
    },
  );

  const solidStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: font.family ?? "inherit",
      fontSize: font.size ?? "inherit",
      fontWeight: String(font.weight ?? 400),
      color: "currentColor",
      WebkitTextStroke: "0px transparent",
    }),
    [font.family, font.size, font.weight],
  );

  const outlineStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: font.family ?? "inherit",
      fontSize: font.size ?? "inherit",
      fontWeight: String(font.weight ?? 400),
      color: "transparent",
      WebkitTextStroke: `${stroke.width ?? "0px"} ${stroke.color ?? "transparent"}`,
    }),
    [font.family, font.size, font.weight, stroke.width, stroke.color],
  );

  return (
    <div
      className={className}
      ref={containerRef}
      role="marquee"
      aria-live="off"
    >
      <div className="overflow-hidden select-none">
        {rowKeys.map((rowKey, rowIndex) => (
          <div
            key={rowKey}
            ref={(el) => {
              if (el) rowRefs.current[rowIndex] = el;
            }}
            className="flex whitespace-nowrap"
          >
            {Array.from({ length: repeats }, (_, i) => {
              const isSolid = i % 2 === 0;
              return (
                <div
                  key={`${rowKey}-cell-${i}`}
                  className="shrink-0 p-4 uppercase"
                  aria-hidden={i > 0}
                  style={isSolid ? solidStyle : outlineStyle}
                >
                  {children ?? text}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
