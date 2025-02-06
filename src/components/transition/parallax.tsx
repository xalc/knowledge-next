"use client";

import { MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 0.5], [-distance, distance]);
}
export default function Parallax({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  useParallax(scrollYProgress, 1500);

  return (
    <section className="snap-start">
      <div ref={ref}>{children}</div>
    </section>
  );
}
