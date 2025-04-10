import ContentCard from "@/components/about/content-card";
import { HeroSection } from "@/components/about/hero-section";
import TopBadge from "@/components/badge/top-badge";
import RecentPosts from "@/components/blogs/recent-blogs";
import RecentReadingBooks from "@/components/wereader/recent-reading";
import Header from "@/components/header/header";
export default function RootPage() {
  return (
    <>
      <HeroSection />
      <Header />
      <ContentCard />
      <RecentPosts />
      <RecentReadingBooks />
      <TopBadge />
    </>
  );
}
