"use client";
import { usePathname } from "next/navigation";
import Header from "./header/header";
import { Link } from "./ui/link";

import { RouteTransition } from "@/components/route-transition";
import { ProgressTranstion } from "./transition/progress-transition";
export default function UILayout({ children }) {
  const pathname = usePathname();
  const landingPage = pathname === "/";

  if (landingPage) {
    return (
      <>
        <meta
          name="google-site-verification"
          content="_lv6oskWRfi00Z3rjMkNWOr9jHofZIU71abSExDAeUs"
        />
        <ProgressTranstion>{children}</ProgressTranstion>
      </>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

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
