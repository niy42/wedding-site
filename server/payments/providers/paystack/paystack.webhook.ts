import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentWebhookResult } from "../../domain/payment.types.js";

export function verifyPaystackSignature(rawBody:string, signatureHeader:string|undefined, secretKey:string){
 if(!signatureHeader)return false;
 const expected=Buffer.from(createHmac("sha512",secretKey).update(rawBody).digest("hex"),"utf8");
 const actual=Buffer.from(signatureHeader.trim(),"utf8");
 return expected.length===actual.length&&timingSafeEqual(expected,actual);
}

interface PaystackWebhookEvent { event:string; data:{ reference:string; id:number; status:string; amount:number; currency:string; paid_at:string|null; metadata?:unknown } }
export function parsePaystackWebhookBody(rawBody:string):PaystackWebhookEvent{
 let value:unknown; try{value=JSON.parse(rawBody)}catch{throw new Error("Malformed webhook JSON")}
 if(!isEvent(value)) throw new Error("Malformed Paystack webhook payload");
 return value;
}
function isEvent(v:unknown):v is PaystackWebhookEvent{
 if(typeof v!=="object"||v===null)return false; const x=v as any, d=x.data;
 return typeof x.event==="string"&&typeof d==="object"&&d!==null&&typeof d.reference==="string"&&Number.isSafeInteger(d.id)&&typeof d.status==="string"&&Number.isSafeInteger(d.amount)&&typeof d.currency==="string";
}

export function normalizePaystackWebhook(rawBody:string,signature:string|undefined,secret:string):PaymentWebhookResult{
 if(!verifyPaystackSignature(rawBody,signature,secret)) return {valid:false,reason:"Invalid webhook signature"};
 const body=parsePaystackWebhookBody(rawBody);
 if(body.event!=="charge.success") return {valid:true,reason:`Ignored event type: ${body.event}`};
 if(body.data.status!=="success") return {valid:true,reason:`Ignored charge status: ${body.data.status}`};
 return {valid:true,event:{reference:body.data.reference,providerReference:String(body.data.id),provider:"paystack",status:"SUCCESSFUL",money:{amountMinor:body.data.amount,currency:body.data.currency as any},occurredAt:body.data.paid_at??new Date().toISOString(),idempotencyKey:`paystack:${body.data.id}`,rawPayload:body}};
}
