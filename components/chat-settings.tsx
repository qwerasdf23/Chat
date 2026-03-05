"use client"

import { useState } from "react"
import { Palette, X } from "lucide-react"
import { useSiteTheme } from "@/components/site-theme-provider"
import { SITE_THEMES, type SiteTheme } from "@/lib/site-theme"

interface ChatSettingsProps {
  theme: SiteTheme
}

export function ChatSettings({ theme }: ChatSettingsProps) {
  const [open, setOpen] = useState(false)
  const { setTheme } = useSiteTheme()

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-xs font-medium" style={{ color: "oklch(0.55 0.04 200)" }}>
        테마
      </span>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: open ? `${theme.accent}28` : "transparent",
          color: open ? theme.accent : "oklch(0.55 0.04 200)",
        }}
        aria-label="테마 선택"
        title="배경·분위기 색 변경"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 rounded-2xl p-3 z-50"
          style={{
            background: "oklch(0.12 0.02 260 / 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${theme.accent}40`,
            boxShadow: `0 8px 32px oklch(0 0 0 / 0.5), 0 0 20px ${theme.panelGlow}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono" style={{ color: "oklch(0.6 0.04 200)" }}>
              색 선택
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-0.5 rounded"
              style={{ color: "oklch(0.5 0.03 200)" }}
              aria-label="닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {SITE_THEMES.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t)
                  setOpen(false)
                }}
                className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-125 active:scale-95"
                style={{
                  background: t.swatch,
                  boxShadow:
                    theme.name === t.name
                      ? `0 0 0 2px oklch(0.08 0 0), 0 0 0 4px ${t.swatch}`
                      : `0 0 8px ${t.swatch}44`,
                }}
                aria-label={`${t.label} 테마`}
                title={t.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
