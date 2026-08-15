import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "parchment" | "ink" | "ivory";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  id?: string;
}

const toneClasses: Record<Tone, string> = {
  parchment: "bg-parchment text-charcoal",
  ivory: "bg-ivory text-charcoal",
  ink: "bg-ink text-ivory",
};

export function Section({ className, tone = "parchment", ...props }: SectionProps) {
  return (
    <section
      className={cn("py-20 sm:py-28", toneClasses[tone], className)}
      {...props}
    />
  );
}
