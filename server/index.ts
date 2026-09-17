import { createServer } from "node:http";
import { app } from "./app.js";
import type { AppEnv } from "./runtime.js";

const env: AppEnv = {
  PAYMENT_PROVIDER: (process.env.PAYMENT_PROVIDER ?? "paystack") as "paystack",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY ?? "",
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  APP_BASE_URL: process.env.APP_BASE_URL ?? "http://localhost:5173",
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? "http://localhost:5173",
  ADMIN_PASSCODE: process.env.ADMIN_PASSCODE ?? "",
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ?? "",
  NODE_ENV: process.env.NODE_ENV,
};

const port = Number(process.env.PORT ?? 4000);

const server = createServer(async (req, res) => {
  const protocol = (req.headers["x-forwarded-proto"] ?? "http").toString().split(",")[0];
  const host = req.headers.host ?? "localhost";
  const url = `${protocol}://${host}${req.url ?? "/"}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
    else if (value != null) headers.set(key, value);
  }
  const request = new Request(url, { method: req.method, headers, body: req.method === "GET" || req.method === "HEAD" ? undefined : req as any, duplex: "half" } as RequestInit & { duplex: "half" });
  const response = await app(request, env);
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } else {
    res.end();
  }
});

server.listen(port, () => console.log(`Wedding API listening on http://localhost:${port}`));
