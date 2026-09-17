import type { PaymentWebhookResult } from "../../domain/payment.types.js";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha512Hex(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  return bytesToHex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

async function timingSafeEqualHex(a: string, b: string): Promise<boolean> {
  const left = new TextEncoder().encode(a.trim().toLowerCase());
  const right = new TextEncoder().encode(b.trim().toLowerCase());
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

export async function verifyPaystackSignature(rawBody: string, signatureHeader: string | undefined, secretKey: string): Promise<boolean> {
  if (!signatureHeader) return false;
  const expected = await hmacSha512Hex(rawBody, secretKey);
  return timingSafeEqualHex(expected, signatureHeader);
}

interface PaystackWebhookEvent {
  event: string;
  data: { reference: string; id: number; status: string; amount: number; requested_amount?: number | string | null; currency: string; paid_at: string | null; metadata?: unknown };
}

export function parsePaystackWebhookBody(rawBody: string): PaystackWebhookEvent {
  let value: unknown;
  try { value = JSON.parse(rawBody); } catch { throw new Error("Malformed webhook JSON"); }
  if (!isEvent(value)) throw new Error("Malformed Paystack webhook payload");
  return value;
}

function isEvent(v: unknown): v is PaystackWebhookEvent {
  if (typeof v !== "object" || v === null) return false;
  const x = v as Record<string, unknown>, d = x.data as Record<string, unknown> | null;
  const requestedAmountValid = d?.requested_amount == null || ((typeof d.requested_amount === "number" || typeof d.requested_amount === "string") && Number.isSafeInteger(Number(d.requested_amount)) && Number(d.requested_amount) >= 0);
  return typeof x.event === "string" && !!d && typeof d.reference === "string" && Number.isSafeInteger(d.id) && typeof d.status === "string" && Number.isSafeInteger(d.amount) && typeof d.currency === "string" && requestedAmountValid;
}

export async function normalizePaystackWebhook(rawBody: string, signature: string | undefined, secret: string): Promise<PaymentWebhookResult> {
  if (!(await verifyPaystackSignature(rawBody, signature, secret))) return { valid: false, reason: "Invalid webhook signature" };
  const body = parsePaystackWebhookBody(rawBody);
  if (body.event !== "charge.success") return { valid: true, reason: `Ignored event type: ${body.event}` };
  if (body.data.status !== "success") return { valid: true, reason: `Ignored charge status: ${body.data.status}` };
  return { valid: true, event: { reference: body.data.reference, providerReference: String(body.data.id), provider: "paystack", status: "SUCCESSFUL", money: { amountMinor: Number(body.data.requested_amount ?? body.data.amount), currency: body.data.currency as any }, occurredAt: body.data.paid_at ?? new Date().toISOString(), idempotencyKey: `paystack:${body.data.id}`, rawPayload: body } };
}
