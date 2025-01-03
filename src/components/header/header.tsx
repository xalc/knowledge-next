import Link from "next/link";
import { ModeToggle } from "./theme-selector";
import { clsx } from "clsx";
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
  NavigationMenuLink,
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
            {/* <Link href="/theme" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Theme
            </NavigationMenuLink>
          </Link> */}
            <Link href="/blogs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Blogs
              </NavigationMenuLink>
            </Link>
            <Link href="/blogs/new" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Blog
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
