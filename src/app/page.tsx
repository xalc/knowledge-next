import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import TopBadge from "@/components/badge/top-badge";
import RecentPosts from "@/components/blogs/recent-blogs";
import Parallax from "@/components/transition/parallax";
import RecentReadingBooks from "@/components/wereader/recent-reading";

export default function RootPage() {
  return (
    <>
      <Parallax>
        <HeroSection />
      </Parallax>
      <Parallax>
        <ContentCard />
        <RecentPosts />
        <RecentReadingBooks />
        <TopBadge />
      </Parallax>
    </>
  );
}
