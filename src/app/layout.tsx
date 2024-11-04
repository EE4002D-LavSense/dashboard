import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/lib/providers/nextui-provider";
import { MapProvider } from "@/lib/providers/map-provider";

import { AppShell } from "@/components/layouts/app-shell";
import { AppNavBar } from "@/components/navigation/app-nav-bar";

import { cn } from "@/lib/tailwind/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LavSense",
  description: "Smart Washroom Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "light")}>
      <body>
        <Providers>
          <MapProvider>
            <AppShell>
              <AppNavBar />
              {children}
            </AppShell>
          </MapProvider>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
