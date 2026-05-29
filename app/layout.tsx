import { Analytics } from "@vercel/analytics/react";

import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

import NoScriptError from "@/app/no-script";
import { Footer } from "@/components/layout/Footer";
import { SongThemeProvider } from "@/providers/SongThemeProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { buildAlternates } from "@/shared/i18n/metadata";
import { linksCategories } from "@/shared/lib/socialLinks";

import { cn } from "@/shared/lib/utils";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

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

const jpNotoSans = Noto_Sans_JP({
  variable: "--font-jp-sans",
  display: "swap",
  preload: false,
  weight: ["400", "600"],
  fallback: ["Hiragino Sans", "Yu Gothic", "Meiryo", "sans-serif"],
});

const jpNotoSerif = Noto_Serif_JP({
  variable: "--font-jp-serif",
  display: "swap",
  preload: false,
  weight: ["500"],
  fallback: ["Yu Mincho", "Hiragino Mincho ProN", "serif"],
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
        "@type": "Person",
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
  alternates: buildAlternates(),
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    description: description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale ?? "en"} suppressHydrationWarning className="min-h-full">
      <head>
        <link rel="preconnect" href="https://r2.ado.fan" crossOrigin="anonymous" />
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      </head>

      <body
        className={cn(inter.className, jpNotoSans.variable, jpNotoSerif.variable)}
      >
        <noscript>
          <style>{`body > :not(noscript) { display: none; }`}</style>
          <NoScriptError />
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SongThemeProvider>{children}</SongThemeProvider>
        </ThemeProvider>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
