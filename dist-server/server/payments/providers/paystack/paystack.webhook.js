import { createHmac, timingSafeEqual } from "node:crypto";
export function verifyPaystackSignature(rawBody, signatureHeader, secretKey) {
    if (!signatureHeader)
        return false;
    const expected = Buffer.from(createHmac("sha512", secretKey).update(rawBody).digest("hex"), "utf8");
    const actual = Buffer.from(signatureHeader.trim(), "utf8");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function parsePaystackWebhookBody(rawBody) {
    let value;
    try {
        value = JSON.parse(rawBody);
    }
    catch {
        throw new Error("Malformed webhook JSON");
    }
    if (!isEvent(value))
        throw new Error("Malformed Paystack webhook payload");
    return value;
}
function isEvent(v) {
    if (typeof v !== "object" || v === null)
        return false;
    const x = v, d = x.data;
    return typeof x.event === "string" && typeof d === "object" && d !== null && typeof d.reference === "string" && Number.isSafeInteger(d.id) && typeof d.status === "string" && Number.isSafeInteger(d.amount) && typeof d.currency === "string";
}
export function normalizePaystackWebhook(rawBody, signature, secret) {
    if (!verifyPaystackSignature(rawBody, signature, secret))
        return { valid: false, reason: "Invalid webhook signature" };
    const body = parsePaystackWebhookBody(rawBody);
    if (body.event !== "charge.success")
        return { valid: true, reason: `Ignored event type: ${body.event}` };
    if (body.data.status !== "success")
        return { valid: true, reason: `Ignored charge status: ${body.data.status}` };
    return { valid: true, event: { reference: body.data.reference, providerReference: String(body.data.id), provider: "paystack", status: "SUCCESSFUL", money: { amountMinor: body.data.amount, currency: body.data.currency }, occurredAt: body.data.paid_at ?? new Date().toISOString(), idempotencyKey: `paystack:${body.data.id}`, rawPayload: body } };
}
