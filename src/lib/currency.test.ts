import { describe, expect, it } from "vitest";
import {
  addMoney,
  formatMoney,
  isValidContributionAmount,
  progressPercent,
  toMajorUnits,
  toMinorUnits,
} from "./currency";

describe("currency conversion", () => {
  it("converts major to minor units without float drift", () => {
    expect(toMinorUnits(25000)).toBe(2500000);
    expect(toMinorUnits(19.99)).toBe(1999);
  });

  it("converts minor back to major units", () => {
    expect(toMajorUnits(2500000)).toBe(25000);
  });
});

describe("formatMoney", () => {
  it("formats NGN amounts", () => {
    expect(formatMoney({ amountMinor: 2500000, currency: "NGN" })).toContain("25,000");
  });

  it("formats GBP amounts", () => {
    const formatted = formatMoney({ amountMinor: 5000, currency: "GBP" });
    expect(formatted).toContain("50");
  });
});

describe("addMoney", () => {
  it("sums amounts of the same currency", () => {
    const result = addMoney(
      { amountMinor: 1000, currency: "NGN" },
      { amountMinor: 500, currency: "NGN" }
    );
    expect(result).toEqual({ amountMinor: 1500, currency: "NGN" });
  });

  it("throws on mismatched currencies", () => {
    expect(() =>
      addMoney({ amountMinor: 1000, currency: "NGN" }, { amountMinor: 500, currency: "USD" })
    ).toThrow();
  });
});

describe("progressPercent", () => {
  it("computes percentage raised toward target", () => {
    const raised = { amountMinor: 250000, currency: "NGN" } as const;
    const target = { amountMinor: 1000000, currency: "NGN" } as const;
    expect(progressPercent(raised, target)).toBe(25);
  });

  it("caps at 100 when raised exceeds target", () => {
    const raised = { amountMinor: 2000000, currency: "NGN" } as const;
    const target = { amountMinor: 1000000, currency: "NGN" } as const;
    expect(progressPercent(raised, target)).toBe(100);
  });

  it("returns 0 with no target", () => {
    const raised = { amountMinor: 2000000, currency: "NGN" } as const;
    expect(progressPercent(raised, undefined)).toBe(0);
  });
});

describe("isValidContributionAmount", () => {
  it("accepts amounts at or above the currency minimum", () => {
    expect(isValidContributionAmount(10000, "NGN")).toBe(true);
    expect(isValidContributionAmount(500, "NGN")).toBe(true);
  });

  it("rejects amounts below the currency minimum", () => {
    expect(isValidContributionAmount(100, "NGN")).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(isValidContributionAmount(Number.NaN, "USD")).toBe(false);
  });
});
