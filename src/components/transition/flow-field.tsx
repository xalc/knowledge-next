"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface FlowFieldProps {
  particleCount?: number;
  baseHue?: number;
}

export function FlowField({ particleCount = 100, baseHue = 220 }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particles: Point[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
      });
    }

    // Animation variables
    let time = 0;
    const flowFieldScale = 0.005;
    const particleSpeed = 2;
    // const fadeSpeed = 0.05;

    // Animation function
    function animate() {
      // Add slight fade effect
      ctx.fillStyle = "rgba(0, 0, 10, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Calculate flow field angle
        const angle =
          Math.sin(particle.x * flowFieldScale + time) *
          Math.cos(particle.y * flowFieldScale + time) *
          Math.PI *
          2;

        // Update velocity
        particle.vx = Math.cos(angle) * particleSpeed;
        particle.vy = Math.sin(angle) * particleSpeed;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        const hue = (baseHue + time * 10) % 360;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
        ctx.stroke();
      });

      time += 0.001;
      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleCount, baseHue]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
