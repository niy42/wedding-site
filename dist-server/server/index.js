import { createServer, } from "node:http";
import { createContribution, handlePaystackWebhook, initializePayment, verifyPayment, HttpError, } from "./routes/payment.routes.js";
import { assertBodySize } from "./lib/validation.js";
import { RateLimiter } from "./lib/rate-limit.js";
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = new Set((process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean));
const limiters = {
    contribution: new RateLimiter(10, 60_000),
    initialize: new RateLimiter(10, 60_000),
    verify: new RateLimiter(30, 60_000),
};
setInterval(() => Object.values(limiters).forEach((limiter) => limiter.cleanup()), 60_000).unref();
function json(res, status, payload) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(payload));
}
function cors(req, res) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-paystack-signature");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}
function clientKey(req) {
    return (req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "unknown");
}
async function readBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(chunk);
        size += buffer.length;
        if (size > 32 * 1024) {
            throw new HttpError(413, "Request body is too large");
        }
        chunks.push(buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    assertBodySize(raw);
    return raw;
}
const server = createServer(async (req, res) => {
    cors(req, res);
    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        return res.end();
    }
    try {
        const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
        const key = clientKey(req);
        if (req.method === "GET" &&
            url.pathname === "/health") {
            return json(res, 200, {
                status: "ok",
            });
        }
        if (req.method === "POST" &&
            url.pathname === "/api/payments/webhook") {
            const rawBody = await readBody(req);
            const headers = Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [
                key.toLowerCase(),
                Array.isArray(value) ? value[0] ?? "" : value ?? "",
            ]));
            const result = await handlePaystackWebhook(rawBody, headers);
            return result.accepted
                ? json(res, 200, { received: true })
                : json(res, 401, {
                    message: "Invalid webhook signature",
                });
        }
        if (req.method === "POST" &&
            url.pathname === "/api/contributions") {
            if (!limiters.contribution.allow(key)) {
                return json(res, 429, {
                    message: "Too many requests",
                });
            }
            const raw = await readBody(req);
            let body;
            try {
                body = JSON.parse(raw);
            }
            catch {
                throw new HttpError(400, "Invalid JSON payload");
            }
            return json(res, 201, await createContribution(body));
        }
        if (req.method === "POST" &&
            url.pathname === "/api/payments/initialize") {
            if (!limiters.initialize.allow(key)) {
                return json(res, 429, {
                    message: "Too many requests",
                });
            }
            const raw = await readBody(req);
            let body;
            try {
                body = JSON.parse(raw);
            }
            catch {
                throw new HttpError(400, "Invalid JSON payload");
            }
            const reference = typeof body === "object" && body !== null
                ? body.reference
                : undefined;
            return json(res, 200, await initializePayment(reference));
        }
        if (req.method === "GET" &&
            url.pathname.startsWith("/api/payments/")) {
            if (!limiters.verify.allow(key)) {
                return json(res, 429, {
                    message: "Too many requests",
                });
            }
            const reference = decodeURIComponent(url.pathname.slice("/api/payments/".length));
            return json(res, 200, await verifyPayment(reference));
        }
        return json(res, 404, {
            message: "Not found",
        });
    }
    catch (error) {
        if (error instanceof HttpError) {
            return json(res, error.status, {
                message: error.message,
            });
        }
        if (error instanceof SyntaxError) {
            return json(res, 400, {
                message: "Invalid JSON payload",
            });
        }
        if (error instanceof Error &&
            /^(Invalid|Only|Contribution amount|Request body)/.test(error.message)) {
            return json(res, 400, {
                message: error.message,
            });
        }
        console.error(error);
        return json(res, 500, {
            message: "Internal server error",
        });
    }
});
server.listen(port, () => {
    console.log(`Wedding API listening on http://localhost:${port}`);
});
