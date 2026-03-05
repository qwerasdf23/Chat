"use client"

/** 전체 사이트 분위기(배경·그리드·오브·파티클·채팅)를 한 번에 바꾸는 테마 */
export interface SiteTheme {
  name: string
  label: string
  swatch: string

  pageBg: string
  gridColor: string
  vignetteTint: string

  orb1Inner: string
  orb1Outer: string
  orb2Inner: string
  orb2Outer: string
  orb3Inner: string

  particleHueCenter: number
  particleHueRange: number
  particleLightness: number
  particleChroma: number
  connectionColor: string

  panelBg: string
  panelBorder: string
  panelGlow: string
  divider: string

  userBg: string
  userBorder: string
  userText: string
  aiBg: string
  aiBorder: string
  aiText: string

  inputBg: string
  inputBorderActive: string
  accent: string
  timeColor: string
}

/** 테마별로 배경·그리드·오브·파티클이 확실히 달라지도록 채도·명도 강화 */
export const SITE_THEMES: SiteTheme[] = [
  {
    name: "cyan",
    label: "Cyan",
    swatch: "oklch(0.75 0.18 195)",

    pageBg: "oklch(0.08 0.035 205)",
    gridColor: "oklch(0.55 0.16 195 / 0.55)",
    vignetteTint: "oklch(0.04 0.02 210 / 0.85)",

    orb1Inner: "oklch(0.55 0.2 200 / 0.35)",
    orb1Outer: "oklch(0.4 0.12 210 / 0.12)",
    orb2Inner: "oklch(0.5 0.18 185 / 0.28)",
    orb2Outer: "oklch(0.38 0.1 190 / 0.1)",
    orb3Inner: "oklch(0.6 0.2 195 / 0.25)",

    particleHueCenter: 195,
    particleHueRange: 28,
    particleLightness: 0.75,
    particleChroma: 0.18,
    connectionColor: "oklch(0.65 0.14 195",

    panelBg: "oklch(0.1 0.03 200 / 0.5)",
    panelBorder: "oklch(0.5 0.14 195 / 0.35)",
    panelGlow: "oklch(0.55 0.16 195 / 0.12)",
    divider: "oklch(0.42 0.1 195 / 0.2)",

    userBg: "oklch(0.32 0.12 195 / 0.5)",
    userBorder: "oklch(0.52 0.12 195 / 0.35)",
    userText: "oklch(0.96 0.02 200)",
    aiBg: "oklch(0.14 0.03 200 / 0.55)",
    aiBorder: "oklch(0.38 0.08 200 / 0.25)",
    aiText: "oklch(0.93 0.01 200)",

    inputBg: "oklch(0.12 0.025 200 / 0.5)",
    inputBorderActive: "oklch(0.55 0.14 195 / 0.45)",
    accent: "oklch(0.78 0.16 195)",
    timeColor: "oklch(0.55 0.1 195)",
  },
  {
    name: "rose",
    label: "Rose",
    swatch: "oklch(0.72 0.2 350)",

    pageBg: "oklch(0.08 0.04 340)",
    gridColor: "oklch(0.55 0.18 350 / 0.55)",
    vignetteTint: "oklch(0.045 0.025 340 / 0.85)",

    orb1Inner: "oklch(0.55 0.22 350 / 0.38)",
    orb1Outer: "oklch(0.42 0.14 340 / 0.12)",
    orb2Inner: "oklch(0.52 0.18 330 / 0.3)",
    orb2Outer: "oklch(0.38 0.12 335 / 0.1)",
    orb3Inner: "oklch(0.6 0.22 345 / 0.28)",

    particleHueCenter: 350,
    particleHueRange: 24,
    particleLightness: 0.72,
    particleChroma: 0.2,
    connectionColor: "oklch(0.65 0.15 350",

    panelBg: "oklch(0.1 0.035 345 / 0.5)",
    panelBorder: "oklch(0.52 0.16 350 / 0.35)",
    panelGlow: "oklch(0.55 0.18 350 / 0.12)",
    divider: "oklch(0.42 0.12 350 / 0.2)",

    userBg: "oklch(0.34 0.14 350 / 0.52)",
    userBorder: "oklch(0.52 0.14 350 / 0.36)",
    userText: "oklch(0.96 0.02 350)",
    aiBg: "oklch(0.14 0.035 340 / 0.55)",
    aiBorder: "oklch(0.38 0.09 340 / 0.26)",
    aiText: "oklch(0.93 0.01 340)",

    inputBg: "oklch(0.12 0.03 345 / 0.5)",
    inputBorderActive: "oklch(0.58 0.16 350 / 0.45)",
    accent: "oklch(0.78 0.2 350)",
    timeColor: "oklch(0.58 0.12 350)",
  },
  {
    name: "amber",
    label: "Amber",
    swatch: "oklch(0.82 0.18 75)",

    pageBg: "oklch(0.09 0.04 65)",
    gridColor: "oklch(0.6 0.18 75 / 0.55)",
    vignetteTint: "oklch(0.045 0.02 60 / 0.85)",

    orb1Inner: "oklch(0.58 0.2 75 / 0.38)",
    orb1Outer: "oklch(0.44 0.12 65 / 0.12)",
    orb2Inner: "oklch(0.54 0.16 55 / 0.3)",
    orb2Outer: "oklch(0.4 0.1 60 / 0.1)",
    orb3Inner: "oklch(0.62 0.2 70 / 0.28)",

    particleHueCenter: 72,
    particleHueRange: 24,
    particleLightness: 0.78,
    particleChroma: 0.18,
    connectionColor: "oklch(0.68 0.14 75",

    panelBg: "oklch(0.11 0.035 68 / 0.5)",
    panelBorder: "oklch(0.55 0.16 75 / 0.35)",
    panelGlow: "oklch(0.58 0.18 75 / 0.12)",
    divider: "oklch(0.45 0.12 75 / 0.2)",

    userBg: "oklch(0.36 0.13 75 / 0.52)",
    userBorder: "oklch(0.54 0.14 75 / 0.36)",
    userText: "oklch(0.96 0.02 75)",
    aiBg: "oklch(0.14 0.03 65 / 0.55)",
    aiBorder: "oklch(0.38 0.08 65 / 0.26)",
    aiText: "oklch(0.93 0.01 65)",

    inputBg: "oklch(0.12 0.025 70 / 0.5)",
    inputBorderActive: "oklch(0.58 0.16 75 / 0.45)",
    accent: "oklch(0.84 0.18 75)",
    timeColor: "oklch(0.6 0.12 75)",
  },
  {
    name: "green",
    label: "Green",
    swatch: "oklch(0.72 0.2 155)",

    pageBg: "oklch(0.08 0.035 152)",
    gridColor: "oklch(0.52 0.16 155 / 0.55)",
    vignetteTint: "oklch(0.04 0.02 150 / 0.85)",

    orb1Inner: "oklch(0.52 0.2 155 / 0.35)",
    orb1Outer: "oklch(0.4 0.12 150 / 0.12)",
    orb2Inner: "oklch(0.48 0.17 140 / 0.28)",
    orb2Outer: "oklch(0.36 0.1 145 / 0.1)",
    orb3Inner: "oklch(0.56 0.2 150 / 0.25)",

    particleHueCenter: 152,
    particleHueRange: 24,
    particleLightness: 0.73,
    particleChroma: 0.18,
    connectionColor: "oklch(0.62 0.14 155",

    panelBg: "oklch(0.1 0.028 152 / 0.5)",
    panelBorder: "oklch(0.5 0.14 155 / 0.35)",
    panelGlow: "oklch(0.52 0.16 155 / 0.12)",
    divider: "oklch(0.4 0.1 155 / 0.2)",

    userBg: "oklch(0.32 0.12 155 / 0.5)",
    userBorder: "oklch(0.5 0.12 155 / 0.35)",
    userText: "oklch(0.96 0.02 155)",
    aiBg: "oklch(0.13 0.03 150 / 0.55)",
    aiBorder: "oklch(0.34 0.08 150 / 0.25)",
    aiText: "oklch(0.93 0.01 150)",

    inputBg: "oklch(0.12 0.025 152 / 0.5)",
    inputBorderActive: "oklch(0.52 0.14 155 / 0.45)",
    accent: "oklch(0.75 0.18 155)",
    timeColor: "oklch(0.54 0.11 155)",
  },
  {
    name: "violet",
    label: "Violet",
    swatch: "oklch(0.68 0.22 285)",

    pageBg: "oklch(0.07 0.04 282)",
    gridColor: "oklch(0.52 0.18 285 / 0.55)",
    vignetteTint: "oklch(0.04 0.025 280 / 0.85)",

    orb1Inner: "oklch(0.52 0.22 285 / 0.38)",
    orb1Outer: "oklch(0.4 0.14 280 / 0.12)",
    orb2Inner: "oklch(0.48 0.18 295 / 0.3)",
    orb2Outer: "oklch(0.36 0.12 290 / 0.1)",
    orb3Inner: "oklch(0.56 0.22 280 / 0.28)",

    particleHueCenter: 282,
    particleHueRange: 28,
    particleLightness: 0.7,
    particleChroma: 0.2,
    connectionColor: "oklch(0.6 0.15 285",

    panelBg: "oklch(0.1 0.035 282 / 0.5)",
    panelBorder: "oklch(0.52 0.16 285 / 0.35)",
    panelGlow: "oklch(0.52 0.18 285 / 0.12)",
    divider: "oklch(0.4 0.12 285 / 0.2)",

    userBg: "oklch(0.32 0.14 285 / 0.52)",
    userBorder: "oklch(0.52 0.14 285 / 0.36)",
    userText: "oklch(0.96 0.02 285)",
    aiBg: "oklch(0.13 0.035 280 / 0.55)",
    aiBorder: "oklch(0.34 0.09 280 / 0.26)",
    aiText: "oklch(0.93 0.01 280)",

    inputBg: "oklch(0.12 0.03 282 / 0.5)",
    inputBorderActive: "oklch(0.54 0.16 285 / 0.45)",
    accent: "oklch(0.74 0.2 285)",
    timeColor: "oklch(0.55 0.14 285)",
  },
]
