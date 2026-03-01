import { Analytics } from "@vercel/analytics/react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import NoScriptError from "@/app/no-script";
import { SongThemeProvider } from "@/providers/SongThemeProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import "@/styles/globals.css";

import { linksCategories } from "@/shared/lib/socialLinks";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

const description =
  "A fan-made tribute to the incredible talent and artistry of Ado, whose music has touched millions of hearts worldwide.";

const sameAs = [
  "https://en.wikipedia.org/wiki/Ado_(singer)",
  ...(linksCategories["social-media"] ?? []).map((l) => l.url),
  ...(linksCategories["music-platforms"] ?? []).map((l) => l.url),
];

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ado.fan/#website",
      name: "ado.fan",
      url: "https://ado.fan",
      description: description,
      about: {
        "@type": "MusicGroup",
        name: "Ado",
        sameAs: sameAs,
      },
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ado.fan"),
  title: {
    default: "ado.fan — A Fan Tribute to Ado",
    template: "%s — ado.fan",
  },
  description: description,
  keywords: [
    "Ado",
    "Ado fan site",
    "Ado music",
    "Ado lyrics",
    "Japanese singer",
    "Utaite",
    "Japanese pop",
    "anime music",
  ],
  alternates: { canonical: "https://ado.fan" },
  authors: [{ name: "ilyvsc", url: "https://github.com/ilyvsc" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ado's Fan Tribute: Japan's Anonymous Superstar",
    description: description,
    url: "https://ado.fan",
    siteName: "ado.fan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ado's Fan Tribute: Japan's Anonymous Superstar",
    description:
      "A fan-made tribute to the incredible talent and artistry of Ado, whose music has touched millions of hearts worldwide.",
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta name="color-scheme" content="dark light" />
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      </head>

      <body className={inter.className}>
        <noscript>
          <style>{`body > :not(noscript) { display: none; }`}</style>
          <NoScriptError />
        </noscript>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SongThemeProvider>{children}</SongThemeProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
