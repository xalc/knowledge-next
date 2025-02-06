import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import TopBadge from "@/components/badge/top-badge";
import RecentReadingBooks from "@/components/wereader/recent-reading";

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <ContentCard />
      <RecentReadingBooks />
      <TopBadge />
    </>
  );
}
