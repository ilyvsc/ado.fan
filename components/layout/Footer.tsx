"use client";

import Link from "next/link";
import React from "react";

import { fanLinks, officialLinks } from "@/utils/lib/constants/social-links";

interface SocialLinkProps {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

function SocialLink({
  name,
  url,
  icon,
  description,
}: Readonly<SocialLinkProps>) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={description}
      title={description}
      className="flex items-center space-x-2 rounded-lg px-3 py-2 transition hover:bg-ado-key/10 hover:text-white focus:ring-2 focus:ring-ado-key focus:outline-none"
    >
      {icon}
      <span className="text-sm md:text-lg">{name}</span>
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex h-full w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl bg-transparent px-4">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-ado-key to-transparent opacity-70" />

        <div className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-6 text-left">
            <h2 className="text-4xl font-semibold text-ado-key">ado.fan</h2>
            <p className="text-lg text-foreground/70">
              A fan-made site celebrating the incredible artistry of Ado.
            </p>
            <p className="text-base text-foreground/60">
              All music, visuals, trademarks and related content remain the
              exclusive property of Universal Music Japan and Ado's official
              staff—this site is not officially affiliated with or endorsed by
              them.
            </p>
          </div>

          <nav aria-label="Social links" className="text-left">
            <h3 className="mb-6 text-3xl font-medium text-ado-key">
              Connect with Ado
            </h3>

            <div className="mb-6">
              <h4 className="mb-3 text-lg font-semibold text-foreground/80 uppercase">
                Official
              </h4>
              <ul className="justify-left flex flex-wrap gap-2 md:justify-start">
                {officialLinks.map((link) => (
                  <li key={link.url}>
                    <SocialLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold text-foreground/80 uppercase">
                Fan Community
              </h4>
              <ul className="justify-left flex flex-wrap gap-2 md:justify-start">
                {fanLinks.map((link) => (
                  <li key={link.url}>
                    <SocialLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mb-6 text-center text-sm text-foreground/70">
          Thank you for visiting—let's honor Ado's talent together!
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-ado-key to-transparent opacity-70" />

        <div className="py-4 text-center text-xs text-foreground/60">
          &copy; {year} Ado Fan Tribute — Powered by passion, not profit.
        </div>
      </div>
    </footer>
  );
}
