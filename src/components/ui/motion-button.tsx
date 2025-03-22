"use client";

import { Button } from "./button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface MotionButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MotionButton({ href, children, icon }: MotionButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
      className="group relative"
    >
      <Button
        variant="outline"
        asChild
        className="relative overflow-hidden rounded-lg border-primary bg-background hover:bg-primary/20"
      >
        <Link href={href} className="group flex items-center">
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          {icon}
          {children}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </motion.div>
  );
}
