import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import { AppShell } from "@/components/layouts/app-shell";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { Providers } from "@/lib/providers/provider";
import { cn } from "@/lib/tailwind/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | LavSense",
    default: "LavSense",
  },
  description: "Smart Washroom Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, "light")}
    >
      <body>
        <Providers>
          <AppShell>
            <AppNavBar />
            {children}
          </AppShell>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
