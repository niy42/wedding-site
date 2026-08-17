import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  targetISO: string;
}

const units: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export function Countdown({ targetISO }: CountdownProps) {
  const parts = useCountdown(targetISO);

  if (parts.isPast) {
    return <p className="font-display text-xl italic text-accent-soft">We're married</p>;
  }

  return (
    <div
      className="flex items-start gap-7 sm:gap-12"
      role="timer"
      aria-label="Time until the wedding"
    >
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-start gap-7 sm:gap-12">
          <div>
            <span className="font-display text-4xl tabular-nums text-accent-soft sm:text-5xl">
              {String(parts[unit.key]).padStart(2, "0")}
            </span>
            <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.24em] text-fg-faint">
              {unit.label}
            </p>
          </div>
          {i < units.length - 1 && <span className="mt-1 text-fg-faint/40">/</span>}
        </div>
      ))}
    </div>
  );
}
