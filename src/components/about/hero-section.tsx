"use client";
import { HeaderLogo } from "../header/header-logo";
import { BezierLines } from "../transition/bezier-lines";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useTransform, useScroll } from "motion/react";
import GreetingMessage from "./greeting-card";
import { ChevronDown } from "lucide-react";
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
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], ["0%", "-100%"]);
  const headerScale = useTransform(scrollY, [0, 100], [0.8, 1]);
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      />
      <BezierLines
        count={5}
        color="hsl(var(--primary))"
        width={1.5}
        animationDuration={15}
        opacity={0.5}
        speed={0.3 + scrollYProgress.get() * 0.5}
        mousePosition={mousePosition}
      />
      <motion.section
        ref={ref}
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        <motion.div
          className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm"
          style={{
            translateY: headerY,
            scale: headerScale,
            opacity: headerOpacity,
          }}
        ></motion.div>
        <div className="container relative px-4">
          <motion.div
            className="flex flex-col items-center space-y-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <HeaderLogo className="h-32 w-32"></HeaderLogo>
            </motion.div>
            <div className="space-y-4">
              <motion.h1
                className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                智能前端 - 与AI同行
              </motion.h1>

              <motion.p
                className="mx-auto max-w-[700px] text-lg font-medium text-muted-foreground/90 sm:text-xl md:text-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                AI 驱动的全栈开发者 & 个人成长的分享者
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {["React", "Next.js", "Shadcn", "AI", "LLM"].map(skill => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </motion.div>
            </div>
          </motion.div>
          <GreetingMessage />
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
              <ChevronDown className="h-6 w-6 text-primary/80" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
