"use client";
import { HeaderLogo } from "../header/header-logo";
import { BezierLines } from "../transition/bezier-lines";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
export const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      />
      <BezierLines
        count={7}
        color="hsl(var(--primary))"
        width={2}
        minCurveHeight={150}
        maxCurveHeight={300}
        animationDuration={15}
        opacity={0.3}
        speed={0.5}
      />
      <div className="relative flex h-screen flex-col items-center justify-center px-4">
        <motion.div
          className="relative flex flex-col items-center justify-center space-y-4"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
          <HeaderLogo className="h-32 w-32"></HeaderLogo>
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.h1
              className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              智能前端 - 与AI同行
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              AI 驱动的全栈开发者 & 前端技术布道师
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {["React", "AI", "Next.js", "TypeScript", "LLM"].map(skill => (
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
      </div>
    </div>
  );
};
