interface ProgressBarProps {
  percent: number;
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
    >
      <div
        className="h-full rounded-full bg-gold transition-[width] duration-700 ease-[var(--ease-editorial)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
