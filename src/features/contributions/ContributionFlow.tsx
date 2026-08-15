import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { formatMoney } from "@/lib/currency";
import { isValidContributionAmount, toMinorUnits } from "@/lib/currency";
import { suggestedAmountsMajor } from "@/lib/wedding-content";
import { api, ApiError } from "@/services/api-client";
import { cn } from "@/lib/cn";
import type { Currency, GiftCategory } from "@/types";

interface ContributionFlowProps {
  category: GiftCategory | null;
  onClose: () => void;
}

type Step = "amount" | "supporter" | "payment" | "error";

const currency: Currency = "NGN";

export function ContributionFlow({ category, onClose }: ContributionFlowProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amountMajor, setAmountMajor] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [supporter, setSupporter] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    isAnonymous: false,
    isPublic: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const open = category !== null;

  function reset() {
    setStep("amount");
    setAmountMajor(null);
    setCustomAmount("");
    setSupporter({ name: "", email: "", phone: "", message: "", isAnonymous: false, isPublic: true });
    setErrorMessage("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleAmountContinue() {
    const chosen = amountMajor ?? Number(customAmount);
    if (!isValidContributionAmount(chosen, currency)) return;
    setAmountMajor(chosen);
    setStep("supporter");
  }

  async function handlePay() {
    if (!category || amountMajor === null) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      const { reference } = await api.createContribution({
        categoryId: category.id,
        money: { amountMinor: toMinorUnits(amountMajor), currency },
        supporter: {
          name: supporter.name,
          email: supporter.email,
          phone: supporter.phone || undefined,
          message: supporter.message || undefined,
          isAnonymous: supporter.isAnonymous,
          isPublic: supporter.isPublic,
        },
      });
      const init = await api.initializePayment(reference);
      if (init.checkoutUrl) {
        window.location.href = init.checkoutUrl;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setStep("error");
      setErrorMessage(
        err instanceof ApiError
          ? "We couldn't start the payment just now. Please try again in a moment."
          : "Something went wrong starting your gift. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const finalAmount = amountMajor ?? (Number(customAmount) || 0);

  return (
    <Dialog open={open} onClose={handleClose} title={category ? category.title : "Send a gift"}>
      {step === "amount" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-charcoal/70">
            Choose an amount, or enter your own — every gift is appreciated, whatever the size.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {suggestedAmountsMajor[currency].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmountMajor(value);
                  setCustomAmount("");
                }}
                className={cn(
                  "rounded-[var(--radius-sm)] border px-4 py-3 text-sm font-medium transition-colors",
                  amountMajor === value
                    ? "border-clay bg-clay/5 text-clay"
                    : "border-ink/20 hover:border-ink/40"
                )}
              >
                {formatMoney({ amountMinor: toMinorUnits(value), currency })}
              </button>
            ))}
          </div>
          <Input
            label="Or enter a custom amount"
            type="number"
            min={1}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmountMajor(null);
            }}
            placeholder={`e.g. 15000`}
          />
          <Button
            size="lg"
            onClick={handleAmountContinue}
            disabled={!isValidContributionAmount(finalAmount, currency)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === "supporter" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-charcoal/70">
            Giving <strong>{formatMoney({ amountMinor: toMinorUnits(finalAmount), currency })}</strong>{" "}
            toward {category?.title}.
          </p>
          <Input
            label="Your name"
            required
            value={supporter.name}
            onChange={(e) => setSupporter((s) => ({ ...s, name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            required
            value={supporter.email}
            onChange={(e) => setSupporter((s) => ({ ...s, email: e.target.value }))}
          />
          <Input
            label="Phone (optional)"
            type="tel"
            value={supporter.phone}
            onChange={(e) => setSupporter((s) => ({ ...s, phone: e.target.value }))}
          />
          <TextArea
            label="A message for the couple (optional)"
            value={supporter.message}
            onChange={(e) => setSupporter((s) => ({ ...s, message: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-clay"
              checked={supporter.isAnonymous}
              onChange={(e) =>
                setSupporter((s) => ({ ...s, isAnonymous: e.target.checked }))
              }
            />
            Keep my gift anonymous
          </label>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("amount")}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handlePay}
              disabled={!supporter.name || !supporter.email || submitting}
            >
              {submitting ? "Starting checkout…" : "Continue to payment"}
            </Button>
          </div>
        </div>
      )}

      {step === "error" && (
        <div className="flex flex-col gap-5">
          <p role="alert" className="text-sm text-clay">
            {errorMessage}
          </p>
          <Button onClick={() => setStep("supporter")}>Try again</Button>
        </div>
      )}
    </Dialog>
  );
}
