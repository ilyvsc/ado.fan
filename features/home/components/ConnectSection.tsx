"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef, useState } from "react";

import { categories } from "@/lib/socialLinks";
import { cn } from "@/shared/lib/utils";

import { SocialIcons } from "../ui/SocialIcons";

gsap.registerPlugin(ScrollTrigger);

export function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState("social-media");

  const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0];
  const activeIndex = categories.findIndex((c) => c.id === activeId);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        headerRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65 },
      )
        .fromTo(
          gsap.utils.toArray("[data-cat-tab]"),
          { autoAlpha: 0, x: -16 },
          { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.08 },
          "-=0.4",
        )
        .fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.3",
        );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!contentRef.current) return;
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
      );
    },
    { dependencies: [activeId] },
  );

  if (!activeCategory) return null;

  return (
    <section
      id="connect"
      ref={sectionRef}
      className="relative w-full bg-ado-secondary/40 py-14"
    >
      <div className="container mx-auto px-4 md:px-2">
        <div ref={headerRef} className="mb-10 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-ado-primary/70" />
            <span className="text-xs font-medium tracking-widest text-ado-primary uppercase">
              Official Channels
            </span>
            <div className="h-px flex-1 bg-ado-primary/30" />
          </div>
          <h2 className="font-serif text-4xl tracking-wide text-foreground uppercase">
            Adomination
          </h2>
          <p className="text-sm leading-relaxed font-light text-muted-foreground">
            Explore the complete ecosystem of official channels, music, and community.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside
            ref={sidebarRef}
            className="flex w-full flex-col gap-2 lg:w-64 lg:shrink-0 xl:w-80"
          >
            <nav className="hidden lg:flex lg:flex-col lg:gap-1">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  data-cat-tab
                  onClick={() => {
                    setActiveId(cat.id);
                  }}
                  className={cn(
                    "group relative flex flex-col gap-1 rounded p-3 text-left transition-all duration-300 outline-none",
                    activeId === cat.id
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {cat.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-xs font-bold transition-all",
                        activeId === cat.id
                          ? "text-foreground/40"
                          : "text-muted-foreground/30 group-hover:text-foreground/30",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs leading-snug transition-all",
                      activeId === cat.id
                        ? "text-foreground/60"
                        : "text-muted-foreground/60 group-hover:text-foreground/50",
                    )}
                  >
                    {cat.description}
                  </p>
                </button>
              ))}
            </nav>

            <nav className="grid w-full grid-cols-2 gap-2 lg:hidden">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  data-cat-tab
                  onClick={() => {
                    setActiveId(cat.id);
                  }}
                  className={cn(
                    "border p-2 text-center text-xs font-bold tracking-wider uppercase transition-all",
                    activeId === cat.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex flex-1 flex-col gap-6">
            <div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
              <div>
                <h3 className="font-serif text-3xl font-medium tracking-wide text-foreground">
                  {activeCategory.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground lg:hidden">
                  {activeCategory.description}
                </p>
              </div>
              <span className="hidden font-mono text-xs text-muted-foreground/50 lg:block">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(categories.length).padStart(2, "0")}
              </span>
            </div>

            <div ref={contentRef}>
              <SocialIcons links={activeCategory.data} />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
