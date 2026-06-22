import { Analytics } from "@vercel/analytics/react";

import NoScriptError from "@/app/no-script";
import { Footer } from "@/components/layout/Footer";

import { getGitHubFooterData } from "@/lib/github";
import { buildAlternates, SITE_KEYWORDS } from "@/lib/metadata";
import { linksCategories } from "@/lib/socialLinks";

import { cn } from "@/lib/utils";
import { SongThemeProvider } from "@/providers/SongThemeProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { gambarino, inter, jpNotoSans, jpNotoSerif } from "@/styles/fonts";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

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
        "@id": "https://ado.fan/#person",
        name: "Ado",
        sameAs: sameAs,
      },
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ado.fan"),
  title: {
    default: "ado.fan - A Fan Tribute to Ado",
    template: "%s - ado.fan",
  },
  alternates: buildAlternates(),
  description: description,
  keywords: SITE_KEYWORDS,
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
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
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
  const [{ locale }, githubData] = await Promise.all([params, getGitHubFooterData()]);

  return (
    <html
      lang={locale ?? "en"}
      suppressHydrationWarning
      className={cn(
        inter.variable,
        gambarino.variable,
        jpNotoSans.variable,
        jpNotoSerif.variable,
      )}
    >
      <head>
        <link rel="preconnect" href="https://r2.ado.fan" crossOrigin="anonymous" />
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      </head>

      <body className="min-h-dvh font-sans">
        <noscript>
          <style>{`body > :not(noscript) { display: none; }`}</style>
          <NoScriptError />
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SongThemeProvider>{children}</SongThemeProvider>
        </ThemeProvider>
        <Footer githubData={githubData} />
        <Analytics />
      </body>
    </html>
  );
}
