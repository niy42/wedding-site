import { HttpError } from "./payment.routes.js";
const SUPPORTED_BASE = "USD";
const SUPPORTED_CURRENCIES = ["USD", "GBP", "EUR", "NGN"];
let cache = null;
export async function getExchangeRates() {
    if (cache && Date.now() < cache.expiresAt) {
        return {
            base: SUPPORTED_BASE,
            rates: cache.rates,
            updatedAt: cache.updatedAt,
        };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD", { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Exchange rate provider returned ${response.status}`);
        }
        const payload = (await response.json());
        if (payload.result !== "success" ||
            payload.base_code !== SUPPORTED_BASE) {
            throw new Error("Exchange rate provider returned an invalid response");
        }
        const rates = Object.fromEntries(SUPPORTED_CURRENCIES.map((currency) => {
            const rate = currency === "USD" ? 1 : payload.rates[currency];
            if (!Number.isFinite(rate) || rate <= 0) {
                throw new Error(`Missing exchange rate for ${currency}`);
            }
            return [currency, rate];
        }));
        const nextUpdate = payload.time_next_update_unix
            ? payload.time_next_update_unix * 1000
            : Date.now() + 60 * 60 * 1000;
        cache = {
            rates,
            updatedAt: payload.time_last_update_utc ?? new Date().toISOString(),
            expiresAt: Math.max(Date.now() + 5 * 60 * 1000, nextUpdate),
        };
        return {
            base: SUPPORTED_BASE,
            rates,
            updatedAt: cache.updatedAt,
        };
    }
    catch (error) {
        // A previously fetched rate is still preferable to taking the
        // converter completely offline if the upstream provider is briefly unavailable.
        if (cache) {
            return {
                base: SUPPORTED_BASE,
                rates: cache.rates,
                updatedAt: cache.updatedAt,
            };
        }
        console.error("Exchange rate lookup failed", error);
        throw new HttpError(503, "Exchange rates are temporarily unavailable");
    }
    finally {
        clearTimeout(timeout);
    }
}
