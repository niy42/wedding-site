import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Level = "display" | "h1" | "h2" | "h3";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  as?: ElementType;
  italic?: boolean;
}

const levelClasses: Record<Level, string> = {
  display: "text-5xl sm:text-7xl leading-[1.02] font-normal",
  h1: "text-4xl sm:text-5xl leading-tight font-normal",
  h2: "text-3xl sm:text-4xl leading-tight font-normal",
  h3: "text-xl sm:text-2xl leading-snug font-medium",
};

const defaultTag: Record<Level, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

export function Heading({
  level = "h2",
  as,
  italic = false,
  className,
  ...props
}: HeadingProps) {
  const Tag = as ?? defaultTag[level];
  return (
    <Tag
      className={cn(
        "font-display text-balance",
        levelClasses[level],
        italic && "italic",
        className
      )}
      {...props}
    />
  );
}
