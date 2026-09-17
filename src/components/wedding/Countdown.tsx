import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  targetISO: string;
}

const units: Array<{
  key: "days" | "hours" | "minutes" | "seconds";
  label: string;
}> = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Mins" },
    { key: "seconds", label: "Secs" },
  ];

export function Countdown({ targetISO }: CountdownProps) {
  const parts = useCountdown(targetISO);

  if (parts.isPast) {
    return (
      <p className="font-display text-xl italic text-accent-soft">
        We're married
      </p>
    );
  }

  return (
    <div
      className="flex max-sm:justify-between items-start gap-2 sm:gap-6 w-full sm:max-w-none max-w-sm"
      role="timer"
      aria-label="Time until the wedding"
    >
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-start gap-2 sm:gap-6">
          <div className="min-w-0 text-center">
            <span className="font-display tabular-nums text-3xl sm:text-5xl text-accent-soft">
              {String(parts[unit.key]).padStart(2, "0")}
            </span>

            <p className="mt-1 text-[0.55rem] text-fg-faint sm:text-[0.65rem] uppercase tracking-[0.16em] sm:tracking-[0.24em]">
              {unit.label}
            </p>
          </div>

          {i < units.length - 1 && (
            <span className="mt-1 text-fg-faint/40 text-sm sm:text-base">
              /
            </span>
          )}
        </div>
      ))}
    </div>
  );
}