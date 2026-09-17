import { describe, expect, it } from "vitest";
import { normalizePaystackWebhook, verifyPaystackSignature } from "./paystack.webhook.js";
const secret = "sk_test_example";
const body = JSON.stringify({ event: "charge.success", data: { reference: "gift_0123456789abcdef0123456789abcdef", id: 12345, status: "success", amount: 101726, currency: "NGN", requested_amount: 100000, paid_at: "2026-09-15T08:00:00Z" } });
describe("Paystack webhook", () => {
    it("validates the HMAC signature", async () => {
        const signature = ""; // Generated below using the same Web Crypto implementation.
        const valid = await verifyPaystackSignature(body, signature, secret);
        expect(valid).toBe(false);
    });
    it("normalizes charge.success", async () => {
        const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
        const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
        const signature = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
        const r = await normalizePaystackWebhook(body, signature, secret);
        expect(r.valid).toBe(true);
        expect(r.event?.idempotencyKey).toBe("paystack:12345");
        expect(r.event?.money).toEqual({ amountMinor: 100000, currency: "NGN" });
    });
    it("ignores signed non-success events", async () => {
        const b = JSON.stringify({ event: "charge.failed", data: { reference: "gift_0123456789abcdef0123456789abcdef", id: 12345, status: "failed", amount: 100000, requested_amount: 100000, currency: "NGN", paid_at: null } });
        const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
        const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(b)));
        const signature = Array.from(bytes, (x) => x.toString(16).padStart(2, "0")).join("");
        expect(await normalizePaystackWebhook(b, signature, secret)).toEqual({ valid: true, reason: "Ignored event type: charge.failed" });
    });
});
