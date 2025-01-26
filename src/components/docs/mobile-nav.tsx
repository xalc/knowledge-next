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

interface MobileNavProps {
  tree: DocNode[];
  currentSlug?: string;
}

export function MobileNav({ tree }: MobileNavProps) {
  return (
    <>
      <Drawer direction="bottom">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-background/95 px-6 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
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
    </>
  );
}
