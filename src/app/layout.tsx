import type { Metadata } from "next";

// These styles apply to every route in the application
import "@/globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import UILayout from "@/components/uiLayout";
import WrapUserProfile from "@/components/auth/user-profile";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "我的博客",
  description: "技术即工具，想法改善生活，个人即服务",
  applicationName: "knowledge next",
  authors: [{ name: "HunterX" }],
  keywords: ["knowledge", "blog", "react", "前端"],
  icons: "/images/HX.svg",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="snap-y snap-mandatory">
      <body>
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
