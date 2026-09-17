import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LoaderCircle, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { convertCurrencyAmount, formatMoney, toMinorUnits } from "@/lib/currency";
import { api, ApiError } from "@/services/api-client";
import type { Currency } from "@/types";

const CONVERTER_CURRENCIES: Array<{ code: Exclude<Currency, "NGN">; label: string }> = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "EUR", label: "EUR — Euro" },
];

const SYMBOLS: Record<Exclude<Currency, "NGN">, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
};

interface CurrencyConverterProps {
  onConvertedAmount: (amountMajor: number) => void;
}

export function CurrencyConverter({ onConvertedAmount }: CurrencyConverterProps) {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Exclude<Currency, "NGN">>("USD");
  const [amount, setAmount] = useState("");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || rates) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    api.getExchangeRates()
      .then((response) => {
        if (!cancelled) setRates(response.rates);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? "We couldn't load the latest rate."
              : "Exchange rates are unavailable right now."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, rates]);

  const convertedAmount = useMemo(() => {
    const value = Number(amount);
    if (!rates || !Number.isFinite(value) || value <= 0) return null;

    return convertCurrencyAmount(value, currency, rates);
  }, [amount, currency, rates]);

  function applyConversion() {
    if (convertedAmount === null) return;
    onConvertedAmount(convertedAmount);
  }

  return (
    <div className="border-t border-border-subtle pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-accent-soft"
        aria-expanded={open}
      >
        <ArrowRightLeft size={13} aria-hidden />
        Convert from another currency
        <ChevronDown
          size={13}
          aria-hidden
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>

      {open && (
        <div className="mt-3 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-elevated p-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="converter-currency"
                className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-fg-faint"
              >
                Currency
              </label>
              <select
                id="converter-currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as Exclude<Currency, "NGN">)
                }
                className="w-full rounded-[var(--radius-sm)] border border-border bg-bg-surface px-3 py-2.5 text-sm text-fg focus:border-accent"
              >
                {CONVERTER_CURRENCIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={`Amount (${SYMBOLS[currency]})`}
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 100"
            />
          </div>

          {loading && (
            <p className="mt-3 flex items-center gap-2 text-xs text-fg-faint">
              <LoaderCircle size={13} className="animate-spin" aria-hidden />
              Loading latest rate…
            </p>
          )}

          {error && (
            <p role="status" className="mt-3 text-xs text-fg-faint">
              {error}
            </p>
          )}

          {!loading && !error && convertedAmount !== null && (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fg-faint">
                  Approximate NGN amount
                </p>
                <p className="mt-0.5 font-display text-lg italic text-accent-soft">
                  {formatMoney({
                    amountMinor: toMinorUnits(convertedAmount),
                    currency: "NGN",
                  })}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-fg-faint">
                  Exchange rates change, so treat this as an estimate.
                </p>
                <a
                  href="https://www.exchangerate-api.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-[0.6rem] text-fg-faint underline decoration-border hover:text-accent-soft"
                >
                  Rates by Exchange Rate API
                </a>
              </div>
              <Button type="button" size="md" className="w-full sm:w-auto" onClick={applyConversion}>
                Use amount
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
