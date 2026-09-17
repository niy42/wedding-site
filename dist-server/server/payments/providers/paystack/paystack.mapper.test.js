import { describe, expect, it } from "vitest";
import { paystackAmountToMoney } from "./paystack.mapper.js";
describe("Paystack amount mapping", () => {
    it("normalizes numeric requested amounts", () => {
        expect(paystackAmountToMoney(5000000, "NGN")).toEqual({
            amountMinor: 5000000,
            currency: "NGN",
        });
    });
    it("normalizes string requested amounts returned by Paystack", () => {
        expect(paystackAmountToMoney("5000000", "NGN")).toEqual({
            amountMinor: 5000000,
            currency: "NGN",
        });
    });
    it("rejects invalid amounts", () => {
        expect(() => paystackAmountToMoney("not-an-amount", "NGN")).toThrow();
    });
});
