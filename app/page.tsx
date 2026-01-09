import { Footer } from "@/components/layout/Footer";
import { FanAppreciation } from "@/features/home/components/AppreciationNote";
import { ConnectSection } from "@/features/home/components/ConnectSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { NewsletterSection } from "@/features/home/components/Newsletter";
import { WhoIsAdo } from "@/features/home/components/WhoIsAdo";
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
