import type { Currency, Money } from "@/types";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
};

/** All currencies used here have 2 minor-unit decimal places (kobo/cents/pence). */
const MINOR_UNIT_FACTOR = 100;

export function toMinorUnits(majorAmount: number): number {
  // Round, never truncate, to avoid systematically under-charging.
  return Math.round(majorAmount * MINOR_UNIT_FACTOR);
}

export function toMajorUnits(minorAmount: number): number {
  return minorAmount / MINOR_UNIT_FACTOR;
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[money.currency], {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
  }).format(toMajorUnits(money.amountMinor));
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add mismatched currencies: ${a.currency} vs ${b.currency}`);
  }
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

export function progressPercent(raised: Money, target?: Money): number {
  if (!target || target.amountMinor <= 0) return 0;
  if (target.currency !== raised.currency) {
    throw new Error("Cannot compute progress across mismatched currencies");
  }
  return Math.min(100, Math.round((raised.amountMinor / target.amountMinor) * 100));
}

const MIN_MAJOR_AMOUNT: Record<Currency, number> = {
  NGN: 500,
  USD: 1,
  GBP: 1,
  EUR: 1,
};

export function isValidContributionAmount(majorAmount: number, currency: Currency): boolean {
  if (!Number.isFinite(majorAmount)) return false;
  if (majorAmount < MIN_MAJOR_AMOUNT[currency]) return false;
  // Reject sub-cent precision entered by the user (e.g. 10.005).
  return Math.round(majorAmount * MINOR_UNIT_FACTOR) === majorAmount * MINOR_UNIT_FACTOR;
}
