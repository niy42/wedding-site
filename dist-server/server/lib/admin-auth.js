import { createHmac, timingSafeEqual } from "node:crypto";
const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
function requiredEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`${name} must be set`);
    return value;
}
function secret() {
    return requiredEnv("ADMIN_SESSION_SECRET");
}
function sign(value) {
    return createHmac("sha256", secret()).update(value).digest("base64url");
}
function parseCookies(req) {
    const header = req.headers.cookie ?? "";
    return Object.fromEntries(header.split(";").map((part) => {
        const index = part.indexOf("=");
        if (index < 0)
            return [part.trim(), ""];
        return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
    }).filter(([key]) => key));
}
export function setAdminSession(res) {
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString("base64url");
    const value = `${payload}.${sign(payload)}`;
    const production = process.env.NODE_ENV === "production";
    const secure = production ? "; Secure" : "";
    const sameSite = production ? "None" : "Strict";
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=${sameSite}${secure}`);
}
export function clearAdminSession(res) {
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`);
}
export function isAdminAuthenticated(req) {
    const value = parseCookies(req)[COOKIE_NAME];
    if (!value)
        return false;
    const [payload, signature] = value.split(".");
    if (!payload || !signature)
        return false;
    const expected = sign(payload);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(actualBuffer, expectedBuffer)) {
        return false;
    }
    try {
        const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        return typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
    }
    catch {
        return false;
    }
}
export function verifyAdminPasscode(passcode) {
    const configured = requiredEnv("ADMIN_PASSCODE");
    if (typeof passcode !== "string")
        return false;
    const actual = Buffer.from(passcode);
    const expected = Buffer.from(configured);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}
