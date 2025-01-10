import type { Metadata } from "next";

// These styles apply to every route in the application
import "@/globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import UILayout from "@/components/uiLayout";
import WrapUserProfile from "@/components/auth/user-profile";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "knowledge next",
  description: "Generated by create next app",
  applicationName: "knowledge next",
  authors: [{ name: "HunterX" }],
  keywords: ["next", "knowledge", "blog", "react", "typescript"],
  icons: "/images/HX.svg",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <Analytics />
      </body>
    </html>
  );
}
