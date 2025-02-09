import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import TopBadge from "@/components/badge/top-badge";
import RecentPosts from "@/components/blogs/recent-blogs";
import RecentReadingBooks from "@/components/wereader/recent-reading";
import SmallHeader from "@/components/header/small-header";
export default function RootPage() {
  return (
    <>
      <HeroSection />
      <SmallHeader />
      <ContentCard />
      <RecentPosts />
      <RecentReadingBooks />
      <TopBadge />
    </>
  );
}
