"use client";
import { usePathname } from "next/navigation";
import Header from "./header/header";

export default function UILayout({ children }) {
  const pathname = usePathname();
  const landingPage = pathname === "/";

  if (landingPage) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-8 w-auto flex-1">{children}</main>

      <footer className="flex w-full basis-12 items-center justify-center border shadow-xl">
        <div>HunterX</div>
      </footer>
    </div>
  );
}
