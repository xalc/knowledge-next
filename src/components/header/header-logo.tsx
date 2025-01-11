"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
export const HeaderLogo = () => {
  const { theme } = useTheme();
  const iconSrc = theme?.includes("dark") ? "/images/HX.svg" : "/images/HX-dark.svg";
  return (
    <h1 className="hidden md:flex">
      <Avatar className="h-12 w-12">
        <AvatarImage src={iconSrc} alt="website title" />
      </Avatar>
    </h1>
  );
};
