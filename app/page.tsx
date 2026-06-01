import { FanAppreciation } from "@/features/home/components/AppreciationNote";
import { ConnectSection } from "@/features/home/components/ConnectSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { NewsletterSection } from "@/features/home/components/Newsletter";
import { WhoIsAdo } from "@/features/home/components/WhoIsAdo";
import { DiscographyTimeline } from "@/features/timeline/Timeline";
import { FloatingThemeButton } from "@/shared/components/themes/ThemeButton";
import { buildAlternates } from "@/shared/lib/metadata";

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
      <ConnectSection />
      <NewsletterSection />
      <FloatingThemeButton />
    </main>
  );
}
