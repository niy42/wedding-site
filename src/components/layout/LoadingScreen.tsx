import { useEffect, useState } from "react";
import { THEME_ID } from "@/lib/wedding-content";
import { cn } from "@/lib/cn";

/**
 * Shows briefly on first load only (not on route changes), then
 * fades permanently. Respects reduced motion by skipping the fade
 * and dismissing near-instantly. Never blocks interaction — it's an
 * overlay, not a route gate.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 550);
    const removeTimer = setTimeout(() => setVisible(false), 900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-300 ease-[var(--ease-editorial)]",
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <span className="eyebrow text-sm tracking-[0.3em]">{THEME_ID}</span>
    </div>
  );
}
