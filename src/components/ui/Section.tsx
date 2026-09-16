import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Tonal steps through the dark system — each section sits one shade
 * apart from its neighbor so the page reads as tonal depth rather
 * than a single flat black canvas.
 */
type Tone = "base" | "elevated" | "surface" | "plum";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  id?: string;
}

const toneClasses: Record<Tone, string> = {
  base: "bg-bg",
  elevated: "bg-bg-elevated",
  surface: "bg-bg-surface",
  plum: "bg-bg-plum",
};

export function Section({ className, tone = "base", ...props }: SectionProps) {
  return (
    <section
      className={cn("py-24 sm:py-32 text-fg", toneClasses[tone], className)}
      {...props}
    />
  );
}
