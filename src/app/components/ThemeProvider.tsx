"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    console.log("🔒 Developed by Vijaya Sai Nandipati – Mythic Dincharya");
  }, []);
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
