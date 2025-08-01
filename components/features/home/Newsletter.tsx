"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";

import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-20">
      <div className="pointer-events-none absolute h-96 w-96 animate-[spin_40s_linear_infinite] rounded-full bg-ado-blue/20 opacity-30 blur-3xl"></div>
      <div className="pointer-events-none absolute right-1/3 bottom-1/4 h-96 w-96 animate-[spin_35s_reverse_linear_infinite] rounded-full bg-ado-red/20 opacity-30 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <Mail className="mx-auto mb-6 h-20 w-20 text-ado-key drop-shadow" />

          <h2 className="mb-4 text-4xl font-black tracking-tighter text-foreground uppercase md:text-7xl">
            Ado Newsletter
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-2xl">
            Stay updated with the latest news, releases, and events — straight
            from Ado's team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto max-w-xl rounded-2xl border-none bg-card/60 p-6 shadow-2xl shadow-ado-key/20 backdrop-blur-lg transition-shadow duration-300 ease-in-out hover:shadow-ado-key/40 md:p-8"
        >
          <h3 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            Subscribe Now
          </h3>

          <p className="mb-6 text-center text-base leading-relaxed text-muted-foreground">
            You will be redirected to the official signup page managed by Ado's
            team.
          </p>

          <Link
            href="https://umusic.jp/ado_nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full"
          >
            <Button
              size="lg"
              className="w-full bg-ado-key px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-ado-key/90 md:px-10 md:py-7 md:text-xl"
            >
              Subscribe to Official Newsletter
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Powered by <span className="text-ado-key">umusic.jp</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
