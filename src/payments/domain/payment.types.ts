/**
 * Generic payment domain model.
 *
 * Nothing in this file, or anywhere outside `payments/providers/*`,
 * may reference Paystack (or any other provider) by name. Providers
 * translate their own vocabulary into these shapes.
 */

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

/**
 * Application-level payment lifecycle. Providers normalize their own
 * status vocabulary into this set — see each adapter's mapper.
 */
export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentProviderId = "paystack" | "flutterwave" | "stripe";

/**
 * Monetary amount stored in minor units (e.g. kobo, cents) to avoid
 * floating-point arithmetic on money anywhere in the app.
 */
export interface Money {
  amountMinor: number;
  currency: Currency;
}

export interface InitializePaymentRequest {
  money: Money;
  reference: string;
  customerEmail: string;
  customerName?: string;
  /** Where the provider's hosted checkout should return the browser to. */
  callbackUrl: string;
  /** Arbitrary, provider-agnostic metadata attached to the payment. */
  metadata?: Record<string, string | number | boolean | null>;
}

export interface PaymentInitialization {
  reference: string;
  /** URL (or provider-popup token) the frontend uses to launch checkout. */
  checkoutUrl?: string;
  provider: PaymentProviderId;
  providerReference: string;
  status: PaymentStatus;
}

export interface PaymentVerification {
  reference: string;
  providerReference: string;
  provider: PaymentProviderId;
  status: PaymentStatus;
  money: Money;
  paidAt?: string;
  raw?: unknown;
}

export interface PaymentWebhookRequest {
  /** Raw request body, needed for signature verification. */
  rawBody: string;
  headers: Record<string, string>;
}

export interface PaymentWebhookResult {
  valid: boolean;
  /** Normalized event — undefined if the payload wasn't a payment event we track. */
  event?: NormalizedPaymentEvent;
  reason?: string;
}

export interface NormalizedPaymentEvent {
  reference: string;
  providerReference: string;
  provider: PaymentProviderId;
  status: PaymentStatus;
  money: Money;
  occurredAt: string;
  /** Idempotency key — providers must guarantee this is unique per real-world event. */
  idempotencyKey: string;
}
