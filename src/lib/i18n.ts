import "server-only";
import { cookies } from "next/headers";
import zhMessages from "../../messages/zh.json";
import enMessages from "../../messages/en.json";

export type Locale = "zh" | "en";
export type Messages = typeof zhMessages;

export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";

const messageMap: Record<Locale, Messages> = {
  zh: zhMessages,
  en: enMessages,
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export function getMessages(locale: Locale): Messages {
  return messageMap[locale] ?? messageMap[defaultLocale];
}

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type MessageKey = NestedKeyOf<Messages>;

export function createTranslator(messages: Messages) {
  return function t(key: MessageKey): string {
    const parts = (key as string).split(".");
    let value: unknown = messages;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return typeof value === "string" ? value : (key as string);
  };
}
