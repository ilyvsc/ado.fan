"use client";

import { motion, useAnimation, useInView, Variants } from "framer-motion";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const contentVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const backgroundVariants: Variants = {
  initial: {
    scale: 1.05,
    filter: "brightness(0.3) blur(42px)",
  },
  animate: {
    scale: 1,
    filter: "brightness(0.5) blur(4px)",
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const backgroundControls = useAnimation();
  const contentControls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isInView) {
      contentControls.start("animate");
    }
  }, [isInView, contentControls]);

  useEffect(() => {
    if (imageLoaded) {
      backgroundControls.start("animate");
    }
  }, [imageLoaded, backgroundControls]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black"
    >
      <motion.div
        initial="initial"
        animate={backgroundControls}
        variants={backgroundVariants}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          willChange: "transform, filter",
        }}
      >
        <Image
          src="https://dyvx7gvcyc9io.cloudfront.net/ado/adonobestadobum/mainvisual_bg1.png"
          alt="Ado Visual"
          fill
          priority
          className="h-full w-full object-cover"
          onLoad={() => setImageLoaded(true)}
          sizes="100vw"
          quality={85}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-background"></div>

      <motion.div
        initial="initial"
        animate={contentControls}
        variants={contentVariants}
        className="z-20 flex flex-col items-center px-6 py-20 text-center"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Image
            src="https://sp.universal-music.co.jp/ado/5thanniversary/assets/images/img-icon.png"
            alt="Ado Logo"
            width={128}
            height={128}
            className="h-32 w-32 object-contain md:h-48 md:w-48"
            priority
            sizes="(max-width: 768px) 128px, 192px"
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-black text-white uppercase drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        >
          <span className="sr-only">Ado --</span>The Voice That Shook Japan
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl xl:text-3xl"
        >
          A force of nature. A whirlwind of raw emotion. A voice that defies
          expectations and leaves hearts trembling in its wake.
        </motion.p>
      </motion.div>
    </section>
  );
}
