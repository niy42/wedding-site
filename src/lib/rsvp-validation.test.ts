import { describe, expect, it } from "vitest";
import { validateRSVP } from "./rsvp-validation";
import type { RSVPFormValues } from "@/types";

const base: RSVPFormValues = {
  fullName: "Amara Obi",
  email: "amara@example.com",
  attending: "yes",
  guestCount: 2,
};

describe("validateRSVP", () => {
  it("accepts a valid attending RSVP", () => {
    expect(validateRSVP(base).valid).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = validateRSVP({ ...base, fullName: "  " });
    expect(result.valid).toBe(false);
    expect(result.errors.fullName).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const result = validateRSVP({ ...base, email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("requires a guest count when attending", () => {
    const result = validateRSVP({ ...base, guestCount: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.guestCount).toBeDefined();
  });

  it("does not require a guest count when not attending", () => {
    const result = validateRSVP({ ...base, attending: "no", guestCount: 0 });
    expect(result.valid).toBe(true);
  });

  it("caps large parties with a guiding message", () => {
    const result = validateRSVP({ ...base, guestCount: 20 });
    expect(result.valid).toBe(false);
  });
});
