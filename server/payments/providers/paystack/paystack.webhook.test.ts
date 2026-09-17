import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { normalizePaystackWebhook, verifyPaystackSignature } from "./paystack.webhook.js";
const secret="sk_test_example";
const body=JSON.stringify({event:"charge.success",data:{reference:"gift_0123456789abcdef0123456789abcdef",id:12345,status:"success",amount:101726,currency:"NGN",requested_amount:100000,paid_at:"2026-09-15T08:00:00Z"}});
const signature=createHmac("sha512",secret).update(body).digest("hex");
describe("Paystack webhook",()=>{it("validates the HMAC signature",()=>{expect(verifyPaystackSignature(body,signature,secret)).toBe(true);expect(verifyPaystackSignature(body,signature.slice(1),secret)).toBe(false)});it("normalizes charge.success",()=>{const r=normalizePaystackWebhook(body,signature,secret);expect(r.valid).toBe(true);expect(r.event?.idempotencyKey).toBe("paystack:12345");expect(r.event?.money).toEqual({amountMinor:100000,currency:"NGN"})});it("ignores signed non-success events",()=>{const b=JSON.stringify({event:"charge.failed",data:{reference:"gift_0123456789abcdef0123456789abcdef",id:12345,status:"failed",amount:100000,requested_amount:100000,currency:"NGN",paid_at:null}});const s=createHmac("sha512",secret).update(b).digest("hex");expect(normalizePaystackWebhook(b,s,secret)).toEqual({valid:true,reason:"Ignored event type: charge.failed"})})});
