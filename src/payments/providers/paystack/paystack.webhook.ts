import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies the `x-paystack-signature` header against the raw request
 * body using the webhook secret. Server-side only.
 * https://paystack.com/docs/payments/webhooks/
 */
export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  webhookSecret: string
): boolean {
  if (!signatureHeader) return false;

  const expected = createHmac("sha512", webhookSecret).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");

  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    id: number;
    status: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    metadata?: unknown;
  };
}

export function parsePaystackWebhookBody(rawBody: string): PaystackWebhookEvent {
  return JSON.parse(rawBody) as PaystackWebhookEvent;
}
