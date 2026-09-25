"use client";

import { useMemo } from "react";

// Deterministic pseudo-random: same on server and client
function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function HeroBackground() {
  const cells = useMemo(() => {
    const darkShades = [
      "rgba(16,185,129,0.10)",
      "rgba(52,211,153,0.15)",
      "rgba(5,150,105,0.08)",
      "rgba(110,231,183,0.20)",
      "rgba(16,185,129,0.15)",
      "rgba(4,120,87,0.10)",
    ];
                      const lightShades = [
      "rgba(255,255,240,0.60)",  // ivory
      "rgba(245,245,220,0.60)",  // beige
      "rgba(250,240,230,0.55)",  // linen
      "rgba(239,222,205,0.55)",  // almond
      "rgba(210,180,140,0.45)",  // tan
      "rgba(195,176,145,0.40)",  // khaki
      "rgba(244,164,96,0.35)",   // sandy brown
      "rgba(193,154,107,0.35)",  // camel
      "rgba(72,60,50,0.25)",     // taupe
      "rgba(175,154,125,0.35)",  // driftwood
    ];
     return Array.from({ length: 144 }).map((_, i) => {
      const r1 = seeded(i + 1);
      const r2 = seeded(i + 100);
      const r3 = seeded(i + 200);
      const idx = Math.floor(r3 * 10);
      // Round to 2 decimals so server/client produce identical strings
      return {
        delay: Math.round(r1 * 800) / 100,
        duration: Math.round((6 + r2 * 6) * 100) / 100,
        dark: darkShades[idx],
        light: lightShades[idx],
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-2 p-4">
        {cells.map((c, i) => (
          <div
            key={i}
            className="rounded-md stall-cell"
            style={{
              ["--light-bg" as any]: c.light,
              ["--dark-bg" as any]: c.dark,
              animationName: "stallPulse",
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .stall-cell {
          background: var(--light-bg);
        }
        :global(.dark) .stall-cell {
          background: var(--dark-bg);
        }
        @keyframes stallPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}