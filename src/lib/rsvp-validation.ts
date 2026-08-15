import type { RSVPFormValues } from "@/types";

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof RSVPFormValues, string>>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRSVP(values: RSVPFormValues): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please tell us your full name.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.attending === "yes") {
    if (!Number.isInteger(values.guestCount) || values.guestCount < 1) {
      errors.guestCount = "Let us know how many will be attending.";
    }
    if (values.guestCount > 10) {
      errors.guestCount = "For parties over 10, please reach out to us directly.";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
