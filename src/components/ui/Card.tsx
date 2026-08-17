import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** An elevated surface, not a generic bordered/shadowed card. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-bg-surface p-7 sm:p-9",
        className
      )}
      {...props}
    />
  );
}
