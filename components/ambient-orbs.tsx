"use client"

import { useSiteTheme } from "@/components/site-theme-provider"

export function AmbientOrbs() {
  const { theme } = useSiteTheme()

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute animate-drift"
        style={{
          top: "-10%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          maxWidth: "750px",
          maxHeight: "750px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orb1Inner} 0%, ${theme.orb1Outer} 40%, transparent 70%)`,
          filter: "blur(50px)",
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute animate-drift"
        style={{
          bottom: "-15%",
          left: "-10%",
          width: "45vw",
          height: "45vw",
          maxWidth: "550px",
          maxHeight: "550px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orb2Inner} 0%, ${theme.orb2Outer} 40%, transparent 70%)`,
          filter: "blur(45px)",
          animationDelay: "-7s",
          animationDuration: "25s",
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute animate-pulse-glow"
        style={{
          top: "30%",
          right: "15%",
          width: "30vw",
          height: "30vw",
          maxWidth: "400px",
          maxHeight: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orb3Inner} 0%, transparent 60%)`,
          filter: "blur(35px)",
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}
