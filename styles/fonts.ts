import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import localFont from "next/font/local";

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

const gambarino = localFont({
  src: [
    {
      path: "./fonts/gambarino/Gambarino-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/gambarino/Gambarino-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-gambarino",
  display: "swap",
  preload: false,
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

export { inter, gambarino, jpNotoSans, jpNotoSerif };
