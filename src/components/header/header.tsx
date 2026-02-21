"use client";
import Link from "next/link";
import { ModeToggle } from "./theme-selector";
import { AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import UserProfile from "./profile";
import { useState } from "react";
import { HeaderLogo } from "./header-logo";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "@/context/locale-provider";
import type { MessageKey } from "@/lib/i18n";

const ROUTE_KEYS: { href: string; key: MessageKey }[] = [
  { href: "/", key: "navigation.welcome" },
  { href: "/blogs", key: "navigation.blogs" },
  { href: "/reading", key: "navigation.reading" },
  { href: "/docs", key: "navigation.docs" },
  { href: "/utils", key: "navigation.utils" },
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
export default function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { t } = useLocale();

  useMotionValueEvent(scrollY, "change", latest => {
    setIsScrolled(latest > 0);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 flex w-full basis-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "border-border shadow-sm" : "border-transparent",
      )}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <AlignJustify className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            hideWhenDetached
            className="mt-2 flex w-screen flex-col gap-2 rounded-md shadow-lg"
          >
            {ROUTE_KEYS.map((route, index) => (
              <LinkButton
                href={route.href}
                key={`route_${index}`}
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t(route.key)}
              </LinkButton>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <h1 className="hidden md:flex">
        <HeaderLogo />
      </h1>

      <div className="hidden space-x-4 md:flex">
        {ROUTE_KEYS.map((route, index) => (
          <LinkButton
            href={route.href}
            key={`route_${index}`}
            className={cn("w-full", pathname === route.href && "text-primary")}
          >
            {t(route.key)}
          </LinkButton>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ModeToggle />
        <UserProfile />
      </div>
    </motion.header>
  );
}
