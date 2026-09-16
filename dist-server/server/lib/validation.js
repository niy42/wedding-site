// import type { Currency } from "../payments/domain/payment.types.js";
// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const MAX_BODY_BYTES = 32 * 1024;
// export interface ContributionInput { categoryId: string; money: { amountMinor: number; currency: Currency }; supporter: { name: string; email: string; phone?: string; message?: string; isAnonymous?: boolean; isPublic?: boolean }; }
// export function assertBodySize(rawBody: string) { if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) throw new Error("Request body is too large"); }
// export function parseContributionInput(value: unknown): ContributionInput {
//   if (!isRecord(value)) throw new Error("Invalid contribution payload"); const money = value.money, supporter = value.supporter;
//   if (!isRecord(money) || !isRecord(supporter)) throw new Error("Invalid contribution payload");
//   const categoryId = string(value.categoryId, 1, 64), amountMinor = money.amountMinor, currency = money.currency;
//   const name = string(supporter.name, 1, 120).trim(), email = string(supporter.email, 3, 320).trim().toLowerCase();
//   if (!Number.isSafeInteger(amountMinor) || amountMinor < 50_000) throw new Error("Contribution amount must be at least NGN 500");
//   if (currency !== "NGN") throw new Error("Only NGN contributions are supported");
//   if (!EMAIL_RE.test(email)) throw new Error("Invalid email address");
//   const phone = optionalString(supporter.phone, 32)?.trim(), message = optionalString(supporter.message, 1000)?.trim();
//   return { categoryId, money: { amountMinor, currency }, supporter: { name, email, phone, message, isAnonymous: optionalBoolean(supporter.isAnonymous), isPublic: supporter.isPublic === undefined ? true : optionalBoolean(supporter.isPublic) } };
// }
// export function parseReference(value: unknown) { if (typeof value !== "string" || !/^gift_[a-f0-9]{32}$/.test(value)) throw new Error("Invalid payment reference"); return value; }
// function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === "object" && v !== null && !Array.isArray(v) }
// function string(v: unknown, min: number, max: number) { if (typeof v !== "string" || v.length < min || v.length > max) throw new Error("Invalid request field"); return v }
// function optionalString(v: unknown, max: number) { if (v === undefined || v === null || v === "") return undefined; return string(v, 1, max) }
// function optionalBoolean(v: unknown) { if (v === undefined) return false; if (typeof v !== "boolean") throw new Error("Invalid boolean field"); return v }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 32 * 1024;
export function assertBodySize(rawBody) {
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
        throw new Error("Request body is too large");
    }
}
export function parseContributionInput(value) {
    if (!isRecord(value)) {
        throw new Error("Invalid contribution payload");
    }
    const money = value.money;
    const supporter = value.supporter;
    if (!isRecord(money) || !isRecord(supporter)) {
        throw new Error("Invalid contribution payload");
    }
    const categoryId = string(value.categoryId, 1, 64);
    const amountMinor = number(money.amountMinor);
    const currency = currencyValue(money.currency);
    const name = string(supporter.name, 1, 120).trim();
    const email = string(supporter.email, 3, 320).trim().toLowerCase();
    if (!Number.isSafeInteger(amountMinor) || amountMinor < 50_000) {
        throw new Error("Contribution amount must be at least NGN 500");
    }
    if (currency !== "NGN") {
        throw new Error("Only NGN contributions are supported");
    }
    if (!EMAIL_RE.test(email)) {
        throw new Error("Invalid email address");
    }
    const phone = optionalString(supporter.phone, 32)?.trim();
    const message = optionalString(supporter.message, 1000)?.trim();
    return {
        categoryId,
        money: {
            amountMinor,
            currency,
        },
        supporter: {
            name,
            email,
            phone,
            message,
            isAnonymous: optionalBoolean(supporter.isAnonymous),
            isPublic: supporter.isPublic === undefined
                ? true
                : optionalBoolean(supporter.isPublic),
        },
    };
}
export function parseReference(value) {
    if (typeof value !== "string" ||
        !/^gift_[a-f0-9]{32}$/.test(value)) {
        throw new Error("Invalid payment reference");
    }
    return value;
}
function isRecord(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function string(v, min, max) {
    if (typeof v !== "string" ||
        v.length < min ||
        v.length > max) {
        throw new Error("Invalid request field");
    }
    return v;
}
function number(v) {
    if (typeof v !== "number") {
        throw new Error("Invalid number field");
    }
    return v;
}
function currencyValue(v) {
    if (v !== "NGN" &&
        v !== "USD" &&
        v !== "GBP" &&
        v !== "EUR") {
        throw new Error("Invalid currency");
    }
    return v;
}
function optionalString(v, max) {
    if (v === undefined || v === null || v === "") {
        return undefined;
    }
    return string(v, 1, max);
}
function optionalBoolean(v) {
    if (v === undefined) {
        return false;
    }
    if (typeof v !== "boolean") {
        throw new Error("Invalid boolean field");
    }
    return v;
}
