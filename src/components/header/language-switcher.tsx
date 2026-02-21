"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLocale } from "@/context/locale-provider";
import { setLocale } from "@/actions/locale";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const targetLocale: Locale = locale === "zh" ? "en" : "zh";

  const handleSwitch = () => {
    startTransition(async () => {
      await setLocale(targetLocale);
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={t("language.switchTo")}
      title={t("language.switchTo")}
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
