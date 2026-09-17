import { assertBodySize } from "./lib/validation.js";
import { RateLimiter } from "./lib/rate-limit.js";
import { getGiftCategories, createRSVP } from "./routes/content.routes.js";
import { adminLogin, adminLogout, getAdminDashboard } from "./routes/admin.routes.js";
import { getExchangeRates } from "./routes/exchange-rates.js";
import { createContribution, handlePaystackWebhook, initializePayment, verifyPayment, HttpError } from "./routes/payment.routes.js";
import type { AppEnv } from "./runtime.js";

const MAX_BODY_BYTES = 32 * 1024;
const localLimiters = {
  contribution: new RateLimiter(10, 60_000),
  rsvp: new RateLimiter(10, 60_000),
  initialize: new RateLimiter(10, 60_000),
  verify: new RateLimiter(30, 60_000),
  exchangeRates: new RateLimiter(20, 60_000),
};
let lastCleanup = 0;

function allowedOrigins(env: AppEnv): Set<string> {
  return new Set(env.CORS_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean));
}

function withCors(response: Response, request: Request, env: AppEnv): Response {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins(env).has(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Headers", "Content-Type, x-paystack-signature");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Credentials", "true");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(payload: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(payload), { status, headers });
}

function clientKey(request: Request): string {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

async function readBody(request: Request): Promise<string> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) throw new HttpError(413, "Request body is too large");
  const raw = await request.text();
  try { assertBodySize(raw); } catch { throw new HttpError(413, "Request body is too large"); }
  return raw;
}

async function readJson(request: Request): Promise<unknown> {
  try { return JSON.parse(await readBody(request)); } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON payload");
  }
}

async function allow(env: AppEnv, limiter: keyof typeof localLimiters, key: string): Promise<boolean> {
  const binding = env.RATE_LIMITERS?.[limiter];
  if (binding) return (await binding.limit({ key })).success;
  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    Object.values(localLimiters).forEach((item) => item.cleanup(now));
    lastCleanup = now;
  }
  return localLimiters[limiter].allow(key, now);
}

function headersToRecord(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

export async function app(request: Request, env: AppEnv): Promise<Response> {
  const url = new URL(request.url);
  const key = clientKey(request);
  try {
    if (request.method === "OPTIONS") return withCors(new Response(null, { status: 204 }), request, env);
    if (request.method === "GET" && url.pathname === "/health") return withCors(json({ status: "ok" }), request, env);
    if (request.method === "GET" && url.pathname === "/api/gift-categories") return withCors(json(await getGiftCategories(env)), request, env);
    if (request.method === "GET" && url.pathname === "/api/exchange-rates") {
      if (!(await allow(env, "exchangeRates", key))) return withCors(json({ message: "Too many requests" }, 429), request, env);
      return withCors(json(await getExchangeRates()), request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/rsvp") {
      if (!(await allow(env, "rsvp", key))) return withCors(json({ message: "Too many requests" }, 429), request, env);
      return withCors(json(await createRSVP(env, await readJson(request)), 201), request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const result = await adminLogin(env, await readJson(request));
      return withCors(json({ authenticated: result.authenticated }, 200, { "Set-Cookie": result.setCookie }), request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/admin/logout") {
      const result = adminLogout();
      return withCors(json({ authenticated: result.authenticated }, 200, { "Set-Cookie": result.setCookie }), request, env);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/dashboard") return withCors(json(await getAdminDashboard(request, env)), request, env);
    if (request.method === "POST" && url.pathname === "/api/payments/webhook") {
      const result = await handlePaystackWebhook(env, await readBody(request), headersToRecord(request.headers));
      return withCors(result.accepted ? json({ received: true }) : json({ message: "Invalid webhook signature" }, 401), request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/contributions") {
      if (!(await allow(env, "contribution", key))) return withCors(json({ message: "Too many requests" }, 429), request, env);
      return withCors(json(await createContribution(env, await readJson(request)), 201), request, env);
    }
    if (request.method === "POST" && url.pathname === "/api/payments/initialize") {
      if (!(await allow(env, "initialize", key))) return withCors(json({ message: "Too many requests" }, 429), request, env);
      const body = await readJson(request);
      const reference = typeof body === "object" && body !== null ? (body as Record<string, unknown>).reference : undefined;
      return withCors(json(await initializePayment(env, reference)), request, env);
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/payments/")) {
      if (!(await allow(env, "verify", key))) return withCors(json({ message: "Too many requests" }, 429), request, env);
      return withCors(json(await verifyPayment(env, decodeURIComponent(url.pathname.slice("/api/payments/".length)))), request, env);
    }
    return withCors(json({ message: "Not found" }, 404), request, env);
  } catch (error) {
    if (error instanceof HttpError) return withCors(json({ message: error.message }, error.status), request, env);
    if (error instanceof Error && /^(Invalid|Only|Contribution amount|Request body)/.test(error.message)) return withCors(json({ message: error.message }, 400), request, env);
    console.error(error);
    return withCors(json({ message: "Internal server error" }, 500), request, env);
  }
}
