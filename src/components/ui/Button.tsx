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
  "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide transition-colors duration-200 ease-[var(--ease-editorial)] disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-sm)]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-ink-soft",
  secondary: "bg-transparent text-ink border border-ink/30 hover:border-ink",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
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
