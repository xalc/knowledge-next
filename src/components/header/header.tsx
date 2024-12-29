import Link from 'next/link';
import { ModeToggle } from './theme-selector';
import { clsx } from "clsx"
import { NavigationMenu, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

export default function () {
  return (<header className='basis-12 shadow-xl border flex justify-between items-center px-8'>
    <h1> Knowledge center </h1>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={clsx(navigationMenuTriggerStyle(), 'uppercase')}>
              Welcome
            </NavigationMenuLink>
          </Link>
          <Link href="/theme" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Theme
            </NavigationMenuLink>
          </Link>
          <Link href="/blogs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Notes
            </NavigationMenuLink>
          </Link>
          <Link href="/blogs/new" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              new Notes
            </NavigationMenuLink>
          </Link>
          <Link href="/login" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              login
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <ModeToggle />
  </header>);
}