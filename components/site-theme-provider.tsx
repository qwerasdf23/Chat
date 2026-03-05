"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { SITE_THEMES, type SiteTheme } from "@/lib/site-theme"

interface SiteThemeContextType {
  theme: SiteTheme
  setTheme: (theme: SiteTheme) => void
}

const SiteThemeContext = createContext<SiteThemeContextType>({
  theme: SITE_THEMES[0],
  setTheme: () => {},
})

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>(SITE_THEMES[0])
  return (
    <SiteThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </SiteThemeContext.Provider>
  )
}

export function useSiteTheme() {
  return useContext(SiteThemeContext)
}
