import Link from "next/link";
import { ModeToggle } from "./theme-selector";
import { clsx } from "clsx";
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";

import UserProfile from "./profile";
export default function NewPost() {
  return (
    <header className="flex basis-12 items-center justify-between border px-8 shadow-xl">
      <h1> Knowledge center </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={clsx(navigationMenuTriggerStyle(), "uppercase")}>
                Welcome
              </NavigationMenuLink>
            </Link>
            <Link href="/blogs" legacyBehavior passHref className='w-full'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Blogs
              </NavigationMenuLink>
            </Link>
            <Link href="/blogs/new" legacyBehavior passHref className='w-full'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Blog
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>


          <NavigationMenuItem>
            <Link href="/calendar" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                2025高速日历
              </NavigationMenuLink>
            </Link>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-1">
        <ModeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
