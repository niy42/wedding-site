interface ProgressBarProps {
  percent: number;
  label?: string;
}

/** A minimal hairline indicator — not a dashboard-style pill bar. */
export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-px w-full overflow-hidden bg-border"
    >
      <div
        className="h-full bg-accent transition-[width] duration-1000 ease-[var(--ease-editorial)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
