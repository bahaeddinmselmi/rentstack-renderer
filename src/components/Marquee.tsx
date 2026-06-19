"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════════
// Marquee — seamless auto-scrolling horizontal row, pauses on hover.
// Harvested from the legacy services-scroll / google-reviews pattern:
// children are duplicated once and scrollLeft wraps at the half point.
// Used by ServicesScroll, Reviews (carousel), and FleetScroll.
// ═══════════════════════════════════════════════════════════════════

export default function Marquee({
  children,
  speed = 0.6,
  fadeColor = "#ffffff",
  gapClassName = "gap-8",
}: {
  children: ReactNode;
  speed?: number;
  fadeColor?: string;
  gapClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, speed]);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32"
        style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32"
        style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
      />
      <div
        ref={ref}
        className={`flex ${gapClassName} hide-scrollbar overflow-x-hidden px-6 pb-4 md:px-12`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
