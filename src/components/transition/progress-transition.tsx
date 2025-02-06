"use client";

import type * as React from "react";
import { motion, useScroll, useSpring } from "motion/react";

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function ProgressTranstion({ children }: RouteTransitionProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="item-center flex min-h-screen w-full flex-col">
      <motion.div
        className={"fixed bottom-0 left-0 right-0 z-50 h-2 bg-primary sm:top-0"}
        style={{ scaleX, transformOrigin: "0%" }}
      />
      {children}
    </div>
  );
}
