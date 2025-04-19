"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
const ROUTES = [
  {
    href: "/blogs",
    label: "博客",
  },
  {
    href: "/reading",
    label: "读书",
  },
  {
    href: "/docs",
    label: "印记",
  },
  {
    href: "/utils",
    label: "工具箱",
  },
];

const LinkButton = ({ href, children, ...props }) => {
  return (
    <Link href={href} legacyBehavior passHref>
      <Button variant="ghost" {...props}>
        {children}
      </Button>
    </Link>
  );
};

export default function SmallHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight; // 假设hero section高度为100vh
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > heroHeight * 0.5); // 当滚动超过hero height的80%时显示
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
          className="sticky top-4 z-50 flex justify-center px-4"
        >
          <div className="duration-400 flex w-full max-w-[520px] items-center justify-between space-x-3 rounded-full border border-primary/15 bg-background/85 px-6 py-2.5 text-primary shadow-xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-background/95 hover:shadow-primary/20">
            {ROUTES.map((route, index) => (
              <LinkButton
                href={route.href}
                key={`route_${index}`}
                className="w-full rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/15 hover:text-primary focus:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
              >
                {route.label}
              </LinkButton>
            ))}
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
