import type { Currency, Money, PaymentStatus } from "../../domain/payment.types";

/**
 * Paystack's own status vocabulary must never leak outside this file.
 * https://paystack.com/docs/payments/verify-payments/
 */
export function mapPaystackStatus(paystackStatus: string): PaymentStatus {
  switch (paystackStatus) {
    case "success":
      return "SUCCESSFUL";
    case "failed":
      return "FAILED";
    case "abandoned":
      return "CANCELLED";
    case "reversed":
      return "REFUNDED";
    case "pending":
    case "queued":
    case "ongoing":
      return "PENDING";
    case "processing":
      return "PROCESSING";
    default:
      return "PENDING";
  }
}

/** Paystack amounts are always in the currency's minor unit already. */
export function paystackAmountToMoney(amountMinor: number, currency: string): Money {
  return { amountMinor, currency: currency as Currency };
}

export function moneyToPaystackAmount(money: Money): number {
  return money.amountMinor;
}
