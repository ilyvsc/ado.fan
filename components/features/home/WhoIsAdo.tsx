"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import adoAvatar from "@/public/images/ado-avatar.jpg";

function AdoDescription() {
  return (
    <div className="flex flex-col items-center lg:items-start lg:text-left">
      <h2 className="font-playfair text-2xl text-foreground md:text-3xl lg:text-4xl">
        A Voice That Shatters Boundaries
      </h2>

      <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
        Ado is a Japanese utaite who began her career covering Vocaloid songs,
        using a stylized avatar to represent herself. She has since transcended
        the utaite scene, releasing original music in collaboration with
        acclaimed composers and lyricists, establishing herself as one of
        Japan's most distinctive and influential vocalists.
      </p>
    </div>
  );
}

export function WhoIsAdo() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const scrolledPast = Math.max(0, windowHeight - rect.top);
        const progress = Math.min(1, scrolledPast / windowHeight);
        setScrollY(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative lg:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="relative h-[200vh]">
            <div className="sticky top-0 h-screen">
              <div className="absolute inset-0 z-0">
                <Image
                  src={adoAvatar}
                  alt="ADO - Japanese singer and artist"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div
              className="relative h-screen w-full overflow-y-auto bg-black"
              style={{
                transform: `translateY(${(1 - scrollY) * 100}vh)`,
                zIndex: 10,
              }}
            >
              <div className="flex h-full items-center justify-center px-6">
                <div className="w-full max-w-lg">
                  <AdoDescription />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative h-full min-h-[700px] overflow-hidden rounded-xl">
            <Image
              src={adoAvatar}
              alt="ADO - Japanese singer and artist"
              fill
              className="object-cover"
              priority
            />
          </div>

          <AdoDescription />
        </div>
      </div>
    </section>
  );
}
