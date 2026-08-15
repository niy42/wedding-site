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
    return <p className="font-display text-xl italic text-gold-bright">We're married! 🎉</p>;
  }

  return (
    <div className="flex items-start gap-6 sm:gap-10" role="timer" aria-label="Time until the wedding">
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <span className="font-display text-4xl tabular-nums sm:text-5xl">
              {String(parts[unit.key]).padStart(2, "0")}
            </span>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">
              {unit.label}
            </p>
          </div>
          {i < units.length - 1 && <span className="text-ivory/20">·</span>}
        </div>
      ))}
    </div>
  );
}
