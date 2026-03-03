import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import StartHere from "@/components/about/start-here";
import TopBadge from "@/components/badge/top-badge";
import RecentPosts from "@/components/blogs/recent-blogs";
import RecentReadingBooks from "@/components/wereader/recent-reading";

export default function RootPage() {
  return (
    <>
      <HeroSection />
      <StartHere />
      <ContentCard />
      <RecentPosts />
      <RecentReadingBooks />
      <TopBadge />
    </>
  );
}
