"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { HeaderLogo } from "../header/header-logo";
import { BezierLines } from "../transition/bezier-lines";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

export const HeroSection = () => {
  const ref = useRef(null);
  const mousePosition = useMousePosition();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], ["0%", "-100%"]);
  const headerScale = useTransform(scrollY, [0, 100], [0.8, 1]);
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--primary)/0.16),transparent_48%),radial-gradient(circle_at_78%_12%,hsl(var(--primary)/0.12),transparent_45%),linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_40%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm12-52c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      />

      <BezierLines
        count={5}
        color="hsl(var(--primary))"
        width={1.5}
        animationDuration={16}
        opacity={0.45}
        speed={0.3 + scrollYProgress.get() * 0.5}
        mousePosition={mousePosition}
      />

      <motion.section
        ref={ref}
        className="relative flex min-h-screen items-center justify-center py-20"
        style={{ opacity, scale }}
      >
        <motion.div
          className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm"
          style={{
            translateY: headerY,
            scale: headerScale,
            opacity: headerOpacity,
          }}
        />

        <div className="container relative px-6">
          <motion.div
            className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <motion.div
                className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/70 px-4 py-2 shadow-sm backdrop-blur"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                  Personal Knowledge Studio
                </span>
                <span className="h-1 w-1 rounded-full bg-primary/70" />
                <span className="text-[11px] text-muted-foreground">持续记录</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  className="text-balance font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  写作与代码交织的
                  <span className="relative ml-2 inline-block">
                    <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent">
                      文艺极客
                    </span>
                  </span>
                </motion.h1>
                <motion.p
                  className="max-w-[560px] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                >
                  在这里，你会看到工程化的知识整理、前端与产品实践，以及持续更新的工具与思考，让个人经验更可持续、更可复用。
                </motion.p>
              </div>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/blogs">
                    阅读文章
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/about">了解我</Link>
                </Button>
                <Link
                  href="/docs"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  进入知识库
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
              >
                {["前端工程", "产品思考", "写作表达", "知识管理"].map(skill => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="absolute -inset-6 rounded-[32px] bg-primary/10 blur-2xl" />
              <div className="relative rounded-[28px] border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
                    <HeaderLogo className="h-14 w-14" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold">HunterX</p>
                    <p className="text-sm text-muted-foreground">全栈开发者 · 知识整理者</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80">
                      Field Notes
                    </p>
                    <p className="mt-2 text-sm text-foreground/80">
                      每周整理一个主题：从系统设计、交互体验，到工具链与个人知识系统。
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">最近更新</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        思考 / 代码 / 工具
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">关注主题</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">产品 × 工程</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center space-y-2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex flex-col items-center"
            >
              <p className="mb-2 text-lg font-medium text-muted-foreground/80">向下滚动查看更多</p>
              <button
                onClick={() => {
                  document
                    .querySelector("#contentCard")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="rounded-full p-2 transition-colors hover:bg-primary/10"
                aria-label="Scroll to content"
              >
                <ChevronDown className="h-6 w-6 text-primary/80" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
