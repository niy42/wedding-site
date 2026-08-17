import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide transition-all duration-300 ease-[var(--ease-editorial)] disabled:opacity-40 disabled:pointer-events-none rounded-[var(--radius-sm)]";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-soft",
  secondary:
    "bg-transparent text-fg border border-fg/25 hover:border-accent hover:text-accent-soft",
  ghost: "bg-transparent text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-sm tracking-[0.05em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
