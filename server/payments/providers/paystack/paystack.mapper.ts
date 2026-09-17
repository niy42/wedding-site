import type { Currency, Money, PaymentStatus } from "../../domain/payment.types.js";

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

/**
 * Paystack returns amounts in the currency's minor unit. `requested_amount`
 * is the amount originally requested from the merchant's application. When
 * customer-paid fees are enabled, Paystack's `amount` can be higher because
 * it includes the fee charged to the customer, while `requested_amount`
 * remains the contribution amount we need to verify against our database.
 */
export function paystackAmountToMoney(
  amountMinor: number | string,
  currency: string,
): Money {
  const normalizedAmount = Number(amountMinor);

  if (!Number.isSafeInteger(normalizedAmount) || normalizedAmount < 0) {
    throw new Error("Paystack returned an invalid transaction amount");
  }

  return {
    amountMinor: normalizedAmount,
    currency: currency as Currency,
  };
}

export function moneyToPaystackAmount(money: Money): number {
  return money.amountMinor;
}
