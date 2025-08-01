"use client";

import { motion, Variants } from "framer-motion";
import { HeartHandshake } from "lucide-react";

import React from "react";

export function FanAppreciation() {
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden bg-transparent py-20">
      <div className="absolute top-0 left-1/3 h-96 w-96 animate-[spin_40s_linear_infinite] rounded-full bg-ado-blue/20 blur-3xl filter" />
      <div className="absolute right-1/4 bottom-0 h-80 w-80 animate-[spin_35s_reverse_linear_infinite] rounded-full bg-ado-red/20 blur-3xl filter" />

      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="relative mx-auto w-fit rounded-3xl border border-white/10 bg-card/50 p-6 shadow-2xl backdrop-blur-xl md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeartHandshake className="mx-auto size-20 text-ado-key md:size-28" />
          </motion.div>

          <motion.h2
            className="mb-8 text-3xl font-black tracking-tighter text-foreground uppercase md:text-5xl"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A Tribute from the Heart
          </motion.h2>

          <motion.p
            className="mx-auto mb-8 max-w-5xl text-lg leading-relaxed text-foreground/90 italic md:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            "As a devoted fan, I created this website to express my gratitude
            for Ado's incredible music. Her powerful vocals and emotional
            delivery have been a source of inspiration and joy in my life."
          </motion.p>

          <motion.p
            className="text-md mx-auto max-w-3xl text-foreground/80 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Debuting in 2020 with the breakout hit{" "}
            <span className="font-semibold text-ado-key">"Usseewa"</span>, Ado's
            voice has captivated millions across the world. In 2022, she lent
            her voice to the character Uta in{" "}
            <span className="font-semibold text-ado-key">
              "One Piece Film: Red"
            </span>{" "}
            further cementing her status as a musical phenomenon.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
