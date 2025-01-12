"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
export const HeaderLogo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const iconSrc = theme?.includes("dark") ? "/images/HX.svg" : "/images/HX-dark.svg";
  return (
    <Avatar className={cn("h-12 w-12", className)}>
      <AvatarImage src={iconSrc} alt="website title" />
      <AvatarFallback>HunterX</AvatarFallback>
    </Avatar>
  );
};
