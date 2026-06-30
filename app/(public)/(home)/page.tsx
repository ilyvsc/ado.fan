import { FloatingThemeButton } from "@/components/themes/ThemeButton";
import { FanAppreciation } from "@/features/home/components/AppreciationNote";
import { ConnectSection } from "@/features/home/components/connect/ConnectSection";
import { CoverMarquee } from "@/features/home/components/CoverMarquee";
import { HeroSection } from "@/features/home/components/HeroSection";
import { NewsletterSection } from "@/features/home/components/Newsletter";
import { WhoIsAdo } from "@/features/home/components/who-is-ado/WhoIsAdo";
import { DiscographyTimeline } from "@/features/timeline/Timeline";

import { buildAlternates } from "@/lib/metadata";

import type { Metadata } from "next";

const description =
  "Fan tribute to Ado, Japan's anonymous singing sensation. Explore lyrics, discography timeline, and more.";

export const metadata: Metadata = {
  title: "ado.fan - Ado Fan Tribute Site",
  description: description,
  alternates: buildAlternates("/"),
  openGraph: {
    title: "ado.fan - Ado Fan Tribute Site",
    description: description,
    url: "https://ado.fan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ado.fan - Ado Fan Tribute Site",
    description: description,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsAdo />
      <DiscographyTimeline />
      <FanAppreciation />
      <CoverMarquee />
      <ConnectSection />
      <NewsletterSection />
      <FloatingThemeButton />
    </main>
  );
}
