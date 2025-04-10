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

const ROUTES = [
  {
    href: "/",
    label: "WELCOME",
  },
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
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 flex basis-12 items-center justify-between border bg-background/95 px-4 shadow-xl">
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
            {ROUTES.map((route, index) => (
              <LinkButton
                href={route.href}
                key={`route_${index}`}
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {route.label}
              </LinkButton>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <h1 className="hidden md:flex">
        <HeaderLogo />
      </h1>

      <div className="hidden space-x-4 md:flex">
        {ROUTES.map((route, index) => (
          <LinkButton
            href={route.href}
            key={`route_${index}`}
            className={cn("w-full", pathname === route.href && "text-primary")}
          >
            {route.label}
          </LinkButton>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <ModeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
