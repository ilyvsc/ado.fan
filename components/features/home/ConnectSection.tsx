"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef, useState } from "react";

import { SocialLinkGrid } from "@/components/SocialLinks";
import { categories } from "@/utils/lib/social-data";

gsap.registerPlugin(ScrollTrigger);

export function ConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState("social-media");

  const activeCategory =
    categories.find((c) => c.id === activeId) ?? categories[0];

  const activeIndex = categories.findIndex((c) => c.id === activeId);

  useGSAP(() => {
    if (!sidebarRef.current) return;

    gsap.from(sidebarRef.current.children, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
      x: -16,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, []);

  useGSAP(
    () => {
      if (!contentRef.current) return;

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [activeId] },
  );

  return (
    <section id="connect" className="relative w-full bg-ado-secondary/20 py-14">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-0">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside
            ref={sidebarRef}
            className="flex flex-col gap-6 lg:w-80 lg:shrink-0"
          >
            <div>
              <h2 className="font-gambarino text-4xl tracking-wide text-foreground uppercase">
                Adomination
              </h2>
              <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground">
                Explore the complete ecosystem of official channels, music, and
                community.
              </p>
            </div>

            <nav className="hidden lg:flex lg:flex-col lg:gap-2">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className={`group flex flex-col gap-1 rounded p-3 text-left transition-all duration-300 ${
                    activeId === cat.id
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {cat.label}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold transition-all ${
                        activeId === cat.id
                          ? "text-foreground/40"
                          : "text-muted-foreground/30 group-hover:text-foreground/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-snug transition-all ${
                      activeId === cat.id
                        ? "text-foreground/60"
                        : "text-muted-foreground/60 group-hover:text-foreground/50"
                    }`}
                  >
                    {cat.description}
                  </p>
                </button>
              ))}
            </nav>
          </aside>

          <nav className="grid w-full grid-cols-2 gap-2 lg:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={`border p-2 text-center text-xs font-bold tracking-wider uppercase transition-all ${
                  activeId === cat.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          <main className="flex flex-1 flex-col gap-6">
            <div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
              <div>
                <h3 className="font-gambarino text-3xl font-medium tracking-wide text-foreground">
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
              <SocialLinkGrid links={activeCategory.data} />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
