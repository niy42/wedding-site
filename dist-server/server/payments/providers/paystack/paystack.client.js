/**
 * Server-side only. This module must never be imported from
 * frontend/browser code — it expects `PAYSTACK_SECRET_KEY` to be
 * present, which is only ever set in the backend environment.
 */
const PAYSTACK_BASE_URL = "https://api.paystack.co";
export class PaystackClient {
    config;
    timeoutMs = 15_000;
    constructor(config) {
        this.config = config;
    }
    async request(path, init) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        let response;
        try {
            response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
                ...init,
                headers: {
                    Authorization: `Bearer ${this.config.secretKey}`,
                    "Content-Type": "application/json",
                    ...init?.headers,
                },
                signal: controller.signal,
            });
        }
        catch (error) {
            throw new Error("Paystack request timed out or could not be reached", { cause: error });
        }
        finally {
            clearTimeout(timeout);
        }
        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Paystack request failed (${response.status})`);
        }
        try {
            return JSON.parse(body);
        }
        catch (error) {
            throw new Error("Paystack returned an invalid JSON response", { cause: error });
        }
    }
    initializeTransaction(params) {
        return this.request("/transaction/initialize", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    verifyTransaction(reference) {
        return this.request(`/transaction/verify/${encodeURIComponent(reference)}`);
    }
}
