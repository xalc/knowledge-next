"use client";
import { usePathname } from "next/navigation";
import Header from "./header/header";
import { Link } from "./ui/link";
export default function UILayout({ children }) {
  const pathname = usePathname();
  const landingPage = pathname === "/";

  if (landingPage) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-auto flex-1">{children}</main>

      <footer className="flex w-full basis-12 items-center justify-center border shadow-xl">
        <p>
          <Link href="mailto:huntxalc@gmail.com">HunterX</Link> © 陕ICP备2024057216号-1
        </p>
      </footer>
    </div>
  );
}
