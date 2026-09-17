const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
function bytesToBase64Url(bytes) {
    let binary = "";
    for (const byte of bytes)
        binary += String.fromCharCode(byte);
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function base64UrlToBytes(value) {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(normalized);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
async function hmac(value, secret) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}
async function timingSafeEqual(a, b) {
    const left = new TextEncoder().encode(a);
    const right = new TextEncoder().encode(b);
    if (left.length !== right.length)
        return false;
    let diff = 0;
    for (let i = 0; i < left.length; i++)
        diff |= left[i] ^ right[i];
    return diff === 0;
}
function parseCookies(request) {
    const header = request.headers.get("cookie") ?? "";
    return Object.fromEntries(header.split(";").map((part) => {
        const index = part.indexOf("=");
        if (index < 0)
            return [part.trim(), ""];
        return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
    }).filter(([key]) => key));
}
export async function createAdminSessionCookie(env) {
    const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    })));
    const value = `${payload}.${await hmac(payload, env.ADMIN_SESSION_SECRET)}`;
    const production = env.NODE_ENV === "production";
    const sameSite = production ? "None" : "Strict";
    const secure = production ? "; Secure" : "";
    return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=${sameSite}${secure}`;
}
export function clearAdminSessionCookie() {
    return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`;
}
export async function isAdminAuthenticated(request, env) {
    const value = parseCookies(request)[COOKIE_NAME];
    if (!value)
        return false;
    const [payload, signature] = value.split(".");
    if (!payload || !signature)
        return false;
    const expected = await hmac(payload, env.ADMIN_SESSION_SECRET);
    if (!(await timingSafeEqual(signature, expected)))
        return false;
    try {
        const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
        return typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
    }
    catch {
        return false;
    }
}
export async function verifyAdminPasscode(passcode, env) {
    if (typeof passcode !== "string")
        return false;
    return timingSafeEqual(passcode, env.ADMIN_PASSCODE);
}
