import { Analytics } from "@vercel/analytics/react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import React from "react";

import NoScriptError from "@/components/NoScriptError";
import { ThemeProvider } from "@/utils/providers/ThemeProvider";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ado Fan Tribute | Japan's Vocal Powerhouse",
  description:
    "A fan-made tribute to the incredible talent and artistry of Ado, whose music has touched millions of hearts worldwide.",
  // Basic SEO
  keywords: ["Ado", "Ado Fan Site", "Ado Music", "Japanese Singer", "Utaite"],
  authors: [{ name: "ilyvsc", url: "https://github.com/ilyvsc" }],
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
      </head>

      <body className={`${inter.className} h-full`}>
        <NoScriptError />

        <div className="js-required">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
