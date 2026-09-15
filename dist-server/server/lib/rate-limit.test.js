import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit.js";
describe("RateLimiter", () => { it("allows up to the configured limit", () => { const l = new RateLimiter(2, 1000); expect(l.allow("a", 0)).toBe(true); expect(l.allow("a", 1)).toBe(true); expect(l.allow("a", 2)).toBe(false); }); it("resets after the window", () => { const l = new RateLimiter(1, 1000); expect(l.allow("a", 0)).toBe(true); expect(l.allow("a", 1001)).toBe(true); }); });
