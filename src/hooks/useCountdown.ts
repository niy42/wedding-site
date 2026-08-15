import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeParts(targetISO: string): CountdownParts {
  const diffMs = new Date(targetISO).getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  };
}

export function useCountdown(targetISO: string): CountdownParts {
  const [parts, setParts] = useState(() => computeParts(targetISO));

  useEffect(() => {
    const interval = setInterval(() => setParts(computeParts(targetISO)), 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  return parts;
}
