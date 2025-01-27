"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { DocNav } from "./doc-nav";
import { DocNode } from "@/types/docs";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  tree: DocNode[];
  currentSlug?: string;
}

export function MobileNav({ tree }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="fixed bottom-12 right-1 z-50 -translate-x-1/2 rounded-full bg-background/95 px-6 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
        >
          <Menu className="mr-2 h-5 w-5" />
          导航目录
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>文档导航</DrawerTitle>
        </DrawerHeader>
        <DocNav tree={tree} mobileView />
      </DrawerContent>
    </Drawer>
  );
}
