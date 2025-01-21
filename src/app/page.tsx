"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronsDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";
export default function Page() {
  const router = useRouter();
  const [hidden, setHidden] = useState(true);
  const navigate = useThrottledCallback(() => router.push("/blogs"), 500);
  useEffect(() => {
    const handleScroll = () => {
      console.log("scroll");
      const scrollPosition = window.scrollY;
      const threshold = window.innerWidth <= 768 ? 150 : 200; // 针对手机设备设置更小的阈值

      if (scrollPosition > threshold) {
        router.push("/new-page");
      }
    };
    const handleWheel = event => {
      if (event.deltaY > 0) {
        navigate();
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [router, navigate]);
  return (
    <section
      onClick={() => setHidden(h => !h)}
      className={
        "absolute flex h-screen w-screen flex-col-reverse items-center justify-center overflow-hidden"
      }
    >
      <Image
        src="https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN"
        alt={"background image"}
        className="inset-0 bg-gradient-to-br from-primary/10 to-background object-cover"
        fill
        priority
        sizes={"w-full"}
      />
      <div className="flex animate-bounce justify-center pt-12 text-sm font-bold text-muted-foreground">
        <ChevronsDown className="h-6 w-6" />
        向下滚动以开始阅读
      </div>
      {!hidden && (
        <div className={"container relative space-y-6 px-4 text-center"}>
          <h1 className="duration-2000 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-4xl font-bold tracking-tighter text-transparent animate-in fade-in slide-in-from-bottom-3 md:text-6xl">
            在Debug中寻找自我
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground mix-blend-difference duration-1000 animate-in fade-in slide-in-from-bottom-4">
            读书/写作/思考/分享/探索
          </p>
          <div className="flex justify-center gap-4 duration-1000 animate-in fade-in slide-in-from-bottom-5">
            <Button size="lg" asChild>
              <Link href="/blogs">开始阅读</Link>
            </Button>
            <Button size="lg" asChild variant="outline">
              <Link href="/about">关于</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
