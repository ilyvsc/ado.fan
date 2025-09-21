import React from "react";

import { Footer } from "@/components/layout/Footer";
import { FanAppreciation } from "@/features/home/AppreciationNote";
import { ConnectSection } from "@/features/home/ConnectSection";
import { HeroSection } from "@/features/home/HeroSection";
import { NewsletterSection } from "@/features/home/Newsletter";
import { WhoIsAdo } from "@/features/home/WhoIsAdo";
import { DiscographyTimeline } from "@/features/timeline/Timeline";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsAdo />
      <FanAppreciation />
      <DiscographyTimeline />
      <ConnectSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
