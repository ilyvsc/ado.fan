import { FanAppreciation } from "@/features/home/components/AppreciationNote";
import { ConnectSection } from "@/features/home/components/ConnectSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { NewsletterSection } from "@/features/home/components/Newsletter";
import { WhoIsAdo } from "@/features/home/components/WhoIsAdo";
import { DiscographyTimeline } from "@/features/timeline/Timeline";
import { FloatingThemeButton } from "@/shared/components/themes/ThemeButton";

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
