"use client";
import Link from "next/link";
import { Button } from "../ui/button";
const ROUTES = [
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
export default function SmallHeader() {
  return (
    <header className="sticky top-4 z-50 flex basis-12 justify-center">
      <div className="flex w-[400px] items-center space-x-4 rounded-2xl border px-4 text-primary shadow-xl">
        {ROUTES.map((route, index) => (
          <LinkButton href={route.href} key={`route_${index}`} className={"w-full"}>
            {route.label}
          </LinkButton>
        ))}
      </div>
    </header>
  );
}
