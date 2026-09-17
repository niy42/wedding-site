import { describe, expect, it } from "vitest";
import { parseContributionInput, parseReference } from "./validation.js";
describe("contribution validation", () => {
    it("accepts a valid NGN contribution", () => { expect(parseContributionInput({ categoryId: "couple-attire", money: { amountMinor: 100000, currency: "NGN" }, supporter: { name: "Ada", email: "ada@example.com" } }).supporter.email).toBe("ada@example.com"); });
    it("rejects under-minimum amounts", () => { expect(() => parseContributionInput({ categoryId: "x", money: { amountMinor: 49999, currency: "NGN" }, supporter: { name: "Ada", email: "ada@example.com" } })).toThrow(); });
    it("rejects invalid email", () => { expect(() => parseContributionInput({ categoryId: "x", money: { amountMinor: 50000, currency: "NGN" }, supporter: { name: "Ada", email: "bad" } })).toThrow(); });
    it("rejects non-NGN currency", () => { expect(() => parseContributionInput({ categoryId: "x", money: { amountMinor: 50000, currency: "USD" }, supporter: { name: "Ada", email: "ada@example.com" } })).toThrow(); });
});
describe("references", () => { it("accepts generated references", () => expect(parseReference("gift_0123456789abcdef0123456789abcdef")).toBeTruthy()); it("rejects arbitrary references", () => expect(() => parseReference("anything")).toThrow()); });
