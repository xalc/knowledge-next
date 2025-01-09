"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const PopoverWrap = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 在组件卸载时移除事件监听器，防止内存泄漏
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>Popover trigger</PopoverTrigger>
      <PopoverContent
        className={cn(
          "data-[side=bottom]:slide-from-top-2 data-[side=left]:slide-from-right-2 data-[side=right]:slide-from-left-2 data-[side=top]:slide-from-bottom-2 z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        )}
      >
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
};
export default PopoverWrap;
