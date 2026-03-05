"use client"

import { ParticleField } from "@/components/particle-field"
import { AmbientOrbs } from "@/components/ambient-orbs"
import { VoidChatInterface } from "@/components/void-chat-interface"
import { SiteThemeProvider, useSiteTheme } from "@/components/site-theme-provider"

function VoidPageContent() {
  const { theme } = useSiteTheme()

  return (
    <main
      className="relative h-dvh w-full overflow-hidden"
      style={{
        background: theme.pageBg,
        transition: "background 0.6s ease",
      }}
    >
      <AmbientOrbs />
      <ParticleField />

      {/* Grid overlay - 테마색이 확 보이도록 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          opacity: 0.12,
          backgroundImage: `linear-gradient(${theme.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transition: "opacity 0.5s, background-image 0.6s",
        }}
        aria-hidden="true"
      />

      {/* Vignette - 테마 톤으로 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: `radial-gradient(ellipse at center, transparent 25%, ${theme.vignetteTint} 100%)`,
          transition: "background 0.6s ease",
        }}
        aria-hidden="true"
      />

      <div className="relative h-full flex items-center justify-center px-4" style={{ zIndex: 10 }}>
        <div className="w-full max-w-lg min-w-[320px] h-[85dvh] min-h-[420px] flex shrink-0">
          <VoidChatInterface />
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <SiteThemeProvider>
      <VoidPageContent />
    </SiteThemeProvider>
  )
}
