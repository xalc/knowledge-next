"use client";

import { createContext, useContext } from "react";
import type { Locale, Messages, MessageKey } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: MessageKey) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const t = (key: MessageKey): string => {
    const parts = (key as string).split(".");
    let value: unknown = messages;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return typeof value === "string" ? value : (key as string);
  };

  return <LocaleContext.Provider value={{ locale, messages, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
