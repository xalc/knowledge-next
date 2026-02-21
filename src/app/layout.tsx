import type { Metadata } from "next";

// These styles apply to every route in the application
import "@/globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import UILayout from "@/components/uiLayout";
import WrapUserProfile from "@/components/auth/user-profile";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/context/locale-provider";
import { getLocale, getMessages } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    applicationName: "knowledge next",
    authors: [{ name: "HunterX" }],
    keywords: ["knowledge", "blog", "react", "前端"],
    icons: "/images/HX.svg",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes"></meta>
      <meta name="apple-mobile-web-app-title" content="blog"></meta>
      <link rel="apple-touch-icon" href="/favor/apple-touch-icon.png" />
      <body>
        <LocaleProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            enableSystem
            defaultTheme="system"
            disableTransitionOnChange
            themes={[
              "light",
              "dark",
              "zinc",
              "zinc-dark",
              "rose",
              "rose-dark",
              "yellow",
              "yellow-dark",
            ]}
          >
            <WrapUserProfile>
              <UILayout>{children}</UILayout>

              <Toaster />
            </WrapUserProfile>
          </ThemeProvider>
        </LocaleProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
