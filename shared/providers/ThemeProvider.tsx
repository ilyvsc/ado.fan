"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import * as React from "react";

import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
