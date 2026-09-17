import { describe, expect, it } from "vitest";
import { PaystackProvider } from "./paystack.provider.js";
const provider = new PaystackProvider({ secretKey: "sk_test_example" });
describe("PaystackProvider", () => {
    it("keeps the requested contribution amount separate from the gross customer charge", async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async () => new Response(JSON.stringify({
            status: true,
            message: "Verification successful",
            data: {
                status: "success",
                reference: "gift_0123456789abcdef0123456789abcdef",
                amount: 5086295,
                requested_amount: 5000000,
                currency: "NGN",
                paid_at: "2026-09-15T08:00:00Z",
                id: 12345,
                metadata: null,
            },
        }), { status: 200, headers: { "Content-Type": "application/json" } });
        try {
            const result = await provider.verifyTransaction("gift_0123456789abcdef0123456789abcdef");
            expect(result.money).toEqual({ amountMinor: 5000000, currency: "NGN" });
            expect(result.raw.amount).toBe(5086295);
        }
        finally {
            globalThis.fetch = originalFetch;
        }
    });
});
