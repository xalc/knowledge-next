'use client'
import Link from "next/link";
import { ModeToggle } from "./theme-selector";
import { AlignJustify } from 'lucide-react'
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import UserProfile from "./profile";
import { useState } from "react";
const ROUTES = [
  {
    href: "/",
    label: "首页"
  },
  {
    href: '/blogs',
    label: '博客'
  }, {
    href: '/blogs/new',
    label: 'new'
  },
  {
    href: "/calendar",
    label: "假期日历"
  },
  // {
  //   href: "/reading",
  //   label: "阅读统计"
  // },
  // {
  //   href: "/articles",
  //   label: "文章"
  // },
  {
    href: "/about",
    label: "关于"
  }
]
const LinkButton = ({ href, children, ...props }) => {
  return (
    <Link href={href} legacyBehavior passHref>
      <Button variant="ghost" {...props}>{children}</Button>
    </Link>
  );
};
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname()
  return (
    <header className="sticky top-0  bg-background/95 z-50 flex basis-12 items-center justify-between border px-4 shadow-xl">
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <AlignJustify className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
            </Button>
          </PopoverTrigger>
          <PopoverContent hideWhenDetached className='flex flex-col gap-2  w-screen rounded-md shadow-lg mt-2'>
            {ROUTES.map((route, index) => (
              <LinkButton href={route.href} key={`route_${index}`} className="w-full " onClick={() => setOpen(false)}>
                {route.label}
              </LinkButton>
            ))}
          </PopoverContent>
        </Popover>

      </div>
      <h1 className='hidden md:flex' >Knowledge center </h1>
      <div className="hidden md:flex space-x-4">
        {ROUTES.map((route, index) => (
          <LinkButton
            disabled={pathname === (route.href)}
            href={route.href} key={`route_${index}`} className={
              cn("w-full",
                pathname === (route.href) && 'text-primary'
              )}>
            {route.label}
          </LinkButton>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <ModeToggle />
        <UserProfile />
      </div>
    </header >
  );
}
