"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import { useRef } from "react";

import rosesCrownSVG from "@/public/images/roses-crown.svg";

gsap.registerPlugin(ScrollTrigger);

export function FanAppreciation() {
  useGSAP(() => {}, []);

  return (
    <section className="relative overflow-hidden bg-ado-secondary/15 py-20">
      <div className="relative mx-auto px-4 text-center">
        <Image
          src={rosesCrownSVG}
          alt="Blue roses tribute to Ado"
          width={300}
          height={300}
          className="mx-auto mb-8"
          priority
        />

        <h2 className="mb-8 text-4xl font-black tracking-tight text-balance text-foreground uppercase md:text-5xl">
          A Tribute from the Heart
        </h2>

        <p className="mx-auto mb-8 font-gambarino text-xl leading-relaxed text-balance text-foreground italic sm:text-wrap md:text-3xl lg:max-w-4xl">
          "As a devoted fan, I created this website to express my gratitude for
          Ado&apos;s incredible music. Her powerful vocals and emotional
          delivery have been a source of inspiration and joy in my life."
        </p>
      </div>
    </section>
  );
}
