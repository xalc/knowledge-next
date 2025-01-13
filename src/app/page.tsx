"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function Page() {
  const router = useRouter();

  return (
    <section className="flex h-screen w-screen items-center justify-center overflow-hidden">
      {/* <link
        rel="preload"
        href="https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN"
      /> */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN")',
        }}
        // style={{
        //   backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        // }}
      />
      <div className="container relative space-y-6 px-4 text-center">
        <h1 className="duration-2000 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-4xl font-bold tracking-tighter text-transparent animate-in fade-in slide-in-from-bottom-3 md:text-6xl">
          在Debug中寻找自我
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground mix-blend-difference delay-200 duration-1000 animate-in fade-in slide-in-from-bottom-4">
          读书/写作/思考/分享/探索
        </p>
        <div className="flex justify-center gap-4 delay-300 duration-1000 animate-in fade-in slide-in-from-bottom-5">
          <Button size="lg" onClick={() => router.push("/blogs")}>
            开始阅读
          </Button>
          <Button size="lg" onClick={() => router.push("/about")} variant="outline">
            关于
          </Button>
        </div>
      </div>
    </section>
  );
}
