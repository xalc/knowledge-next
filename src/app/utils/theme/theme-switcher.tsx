"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
  const { setTheme, themes, theme } = useTheme();
  return (
    <div className="mx-10">
      <p className="text-primary"> current theme {theme}</p>
      <div className="mx-8 flex flex-auto flex-wrap gap-8">
        {themes.map((t, i) => {
          return (
            <Button key={t + i} variant="default" onClick={() => setTheme(t)}>
              {t}
            </Button>
          );
        })}
      </div>
      <p className="text-primary"> text-primary</p>
      <p className="text-primary-foreground"> text-primary-foreground</p>
      <p className="text-secondary"> text-secondary</p>
      <p className="text-secondary-foreground"> text-secondary-foreground</p>
      <p className="text-muted"> text-muted</p>
      <p className="text-muted-foreground"> text-muted-foreground</p>
      <p className="text-destructive"> text-destructive</p>
      <p className="text-destructive-foreground"> text-destructive-foreground</p>
      <p className="text-accent"> text-accent</p>
      <p className="text-accent-foreground"> text-accent-foreground</p>
      <p className="text-card"> text-card</p>
      <p className="text-card-foreground"> text-card-foreground</p>

      <div className="my-8">
        <p className="text-3xl text-foreground"> 尽量使用如下几种</p>
        <p className="text-foreground"> text-foreground</p>
        <p className="text-muted-foreground"> text-muted-foreground</p>
        <p className="text-accent-foreground"> text-accent-foreground</p>
      </div>
      <div className="flex gap-5">
        <div className="h-10 w-10 border-4 border-border bg-background"></div>
        <div className="h-10 w-10 border-4 border-border bg-foreground"></div>
        <div className="h-10 w-10 border-4 border-border bg-primary"></div>
        <div className="h-10 w-10 border-4 border-border bg-primary-foreground"></div>
        <div className="h-10 w-10 border-4 border-border bg-secondary"></div>
        <div className="h-10 w-10 border-4 border-border bg-secondary-foreground"></div>
        <div className="h-10 w-10 border-4 border-border bg-primary"></div>
        <div className="h-10 w-10 border-4 border-border bg-ring"></div>
      </div>
    </div>
  );
}
