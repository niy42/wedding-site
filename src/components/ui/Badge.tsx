import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold/40 px-3 py-1 text-[0.7rem] uppercase tracking-[0.15em] text-gold",
        className
      )}
      {...props}
    />
  );
}
