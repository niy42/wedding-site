import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-ink/10 bg-ivory p-6 sm:p-8",
        className
      )}
      {...props}
    />
  );
}
