# Cloudflare deployment

This project uses one Cloudflare Worker for the API and the Vite build as Worker static assets. Supabase remains the database and Paystack remains the payment provider.

## Local Node mode

Copy `.env.example` to `.env` and run:

```bash
npm run dev
npm run server
```

The Node server is only an adapter. Application routing lives in `server/app.ts`, so local development and Cloudflare use the same API code.

## Cloudflare mode

Build and deploy:

```bash
npm run deploy
```

For local Cloudflare runtime testing:

```bash
cp .dev.vars.example .dev.vars
npm run build
npm run worker:dev
```

Set the production secrets/variables through Wrangler/Cloudflare. Do not commit `.dev.vars`.

Required values:

- `PAYMENT_PROVIDER=paystack`
- `PAYSTACK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL`
- `CORS_ORIGINS`
- `ADMIN_PASSCODE`
- `ADMIN_SESSION_SECRET`

The deployed Worker serves `/api/*` and `/health`; all other routes are served from the Vite `dist` assets with SPA fallback.

The Cloudflare rate-limit binding is used when present. The Node adapter falls back to the existing in-memory limiter for local development.
