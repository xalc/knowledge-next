"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useAnimationFrame } from "motion/react";
interface Point {
  x: number;
  y: number;
}

interface BezierLinesProps {
  count?: number;
  color?: string;
  width?: number;
  minCurveHeight?: number;
  maxCurveHeight?: number;
  animationDuration?: number;
  opacity?: number;
  speed?: number;
}

export function BezierLines({
  count = 5,
  color = "hsl(var(--primary))",
  width = 2,
  minCurveHeight = 100,
  maxCurveHeight = 200,
  animationDuration = 8,
  opacity = 0.3,
  speed = 0.5,
}: BezierLinesProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const animationState = useRef({
    time: 0,
    offsets: Array(count)
      .fill(0)
      .map(() => Math.random() * Math.PI * 2),
  });

  const generatePath = useCallback(
    (index: number, time: number) => {
      if (!dimensions.width || !dimensions.height) return "";

      const startY = dimensions.height / 2;
      const baseOffset = (index - Math.floor(count / 2)) * (dimensions.height / count);
      const points: Point[] = [];
      const segments = 8;

      for (let i = 0; i <= segments; i++) {
        const x = (dimensions.width * i) / segments;
        const progress = i / segments;

        const wave1 =
          Math.sin(time * speed + progress * Math.PI * 2 + animationState.current.offsets[index]) *
          50;
        const wave2 = Math.sin(time * speed * 0.5 + progress * Math.PI * 4) * 30;
        const wave3 = Math.sin(time * speed * 0.3 + progress * Math.PI * 6) * 20;

        const y = startY + baseOffset + wave1 + wave2 + wave3;
        points.push({ x, y });
      }

      let path = `M ${points[0].x},${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const cp1x = current.x + (next.x - current.x) / 3;
        const cp2x = current.x + ((next.x - current.x) * 2) / 3;
        const cp1y = current.y;
        const cp2y = next.y;

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      }

      return path;
    },
    [dimensions, count, minCurveHeight, maxCurveHeight, speed],
  );

  useAnimationFrame(time => {
    if (dimensions.width && dimensions.height) {
      animationState.current.time = time * 0.001;
      const newPaths = Array.from({ length: count }, (_, i) =>
        generatePath(i, animationState.current.time),
      );
      setPaths(newPaths);
    }
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  if (!dimensions.width || !dimensions.height) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <svg width="100%" height="100%" className="opacity-50">
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke={color}
            strokeWidth={width}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity }}
            transition={{
              duration: animationDuration,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: (index * animationDuration) / count,
            }}
            style={{
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
