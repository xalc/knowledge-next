"use client";
import { usePathname } from "next/navigation";
import Header from "./header/header";
import { Link } from "./ui/link";
import { motion, useScroll, useSpring } from "motion/react";
import { RouteTransition } from "@/components/route-transition";
export default function UILayout({ children }) {
  const pathname = usePathname();
  const landingPage = pathname === "/";
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (landingPage) {
    return (
      <>
        <meta
          name="google-site-verification"
          content="_lv6oskWRfi00Z3rjMkNWOr9jHofZIU71abSExDAeUs"
        />
        {children}
      </>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <motion.div
        className={"fixed bottom-0 left-0 right-0 z-50 h-2 bg-primary sm:top-0"}
        style={{ scaleX, transformOrigin: "0%" }}
      />
      <main className="w-auto flex-1">
        <RouteTransition>{children}</RouteTransition>
      </main>

      <footer className="flex w-full shrink-0 basis-12 items-center justify-center border shadow-xl">
        <p>
          <Link href="mailto:huntxalc@gmail.com">HunterX</Link> © 陕ICP备2024057216号-1
        </p>
      </footer>
    </div>
  );
}
