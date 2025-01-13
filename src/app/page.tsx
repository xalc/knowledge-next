import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <section className="absolute flex h-screen w-screen items-center justify-center overflow-hidden">
      <link
        rel="preload"
        as="image"
        href="https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN"
      />
      <Image
        src="https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN"
        alt={"background image"}
        className="inset-0 bg-gradient-to-br from-primary/10 to-background object-cover"
        fill
        priority
      />
      {/* <div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN")',
        }}
      /> */}
      <div className="container relative space-y-6 px-4 text-center">
        <h1 className="duration-2000 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-4xl font-bold tracking-tighter text-transparent animate-in fade-in slide-in-from-bottom-3 md:text-6xl">
          在Debug中寻找自我
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground mix-blend-difference delay-200 duration-1000 animate-in fade-in slide-in-from-bottom-4">
          读书/写作/思考/分享/探索
        </p>
        <div className="flex justify-center gap-4 delay-300 duration-1000 animate-in fade-in slide-in-from-bottom-5">
          <Button size="lg" asChild>
            <Link href="/blogs">开始阅读</Link>
          </Button>
          <Button size="lg" asChild variant="outline">
            <Link href="/about">关于</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
