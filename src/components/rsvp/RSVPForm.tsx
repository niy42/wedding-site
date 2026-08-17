import { useState } from "react";
import type { FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateRSVP } from "@/lib/rsvp-validation";
import { api, ApiError } from "@/services/api-client";
import type { RSVPFormValues, RSVPSubmissionState } from "@/types";

const initialValues: RSVPFormValues = {
  fullName: "",
  email: "",
  phone: "",
  attending: "yes",
  guestCount: 1,
  dietaryNotes: "",
  note: "",
};

export function RSVPForm() {
  const [values, setValues] = useState<RSVPFormValues>(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateRSVP>["errors"]>({});
  const [state, setState] = useState<RSVPSubmissionState>({ status: "idle" });

  function update<K extends keyof RSVPFormValues>(key: K, value: RSVPFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validateRSVP(values);
    setErrors(result.errors);
    if (!result.valid) return;

    setState({ status: "submitting" });
    try {
      const response = await api.submitRSVP(values);
      setState({ status: response.status === "duplicate" ? "duplicate" : "success" });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? "We couldn't reach the server just now. Please try again in a moment."
          : "Something went wrong. Please try again.";
      setState({ status: "error", message });
    }
  }

  if (state.status === "success" || state.status === "duplicate") {
    return (
      <Section id="rsvp" tone="elevated">
        <Container className="text-center">
          <Heading level="h2" as="p" italic className="text-fg">
            {state.status === "success" ? "See you there" : "You're already on the list"}
          </Heading>
          <p className="mx-auto mt-5 max-w-md text-fg-muted">
            {state.status === "success"
              ? "Thank you for letting us know — we can't wait to celebrate with you."
              : "We already have your RSVP recorded. Reach out to us directly if you need to make a change."}
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="rsvp" tone="elevated">
      <Container className="grid gap-12 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
        <div>
          <span className="eyebrow">RSVP</span>
          <Heading level="h2" as="p" className="mt-4">
            Will you join us?
          </Heading>
          <p className="mt-5 max-w-sm text-fg-muted">
            Kindly let us know by six weeks before the wedding so we can plan properly for
            everyone.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Full name"
                required
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                error={errors.fullName}
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                required
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
                autoComplete="email"
              />
            </div>

            <Input
              label="Phone (optional)"
              type="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
            />

            <fieldset className="flex flex-col gap-2.5">
              <legend className="text-[0.7rem] font-medium uppercase tracking-[0.15em] text-fg-muted">
                Will you be attending?
              </legend>
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((option) => (
                  <label
                    key={option}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-border px-4 py-3 text-sm text-fg-muted transition-colors has-[:checked]:border-accent has-[:checked]:text-accent-soft"
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={option}
                      checked={values.attending === option}
                      onChange={() => update("attending", option)}
                      className="accent-[var(--color-accent)]"
                    />
                    {option === "yes" ? "Joyfully accept" : "Regretfully decline"}
                  </label>
                ))}
              </div>
            </fieldset>

            {values.attending === "yes" && (
              <>
                <Input
                  label="Number of guests (including you)"
                  type="number"
                  min={1}
                  max={10}
                  value={values.guestCount}
                  onChange={(e) => update("guestCount", Number(e.target.value))}
                  error={errors.guestCount}
                />
                <TextArea
                  label="Dietary requirements"
                  value={values.dietaryNotes}
                  onChange={(e) => update("dietaryNotes", e.target.value)}
                  placeholder="Allergies, vegetarian, halal, etc."
                />
              </>
            )}

            <TextArea
              label="A note for the couple (optional)"
              value={values.note}
              onChange={(e) => update("note", e.target.value)}
            />

            {state.status === "error" && (
              <p role="alert" className="text-sm text-rose">
                {state.message}
              </p>
            )}

            <Button type="submit" size="lg" disabled={state.status === "submitting"}>
              {state.status === "submitting" ? "Sending…" : "Send RSVP"}
            </Button>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
