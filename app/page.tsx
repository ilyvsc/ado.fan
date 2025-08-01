import React from "react";

import { Footer } from "@/components/layout/Footer";
import { FeaturedSongs } from "@/features/featured-songs/FeaturedSongs";
import { FanAppreciation } from "@/features/home/AppreciationNote";
import { ConnectSection } from "@/features/home/ConnectSection";
import { HeroSection } from "@/features/home/HeroSection";
import { NewsletterSection } from "@/features/home/Newsletter";
import { DiscographyTimeline } from "@/features/timeline/Timeline";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FanAppreciation />
      <FeaturedSongs />
      <DiscographyTimeline />
      <ConnectSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
