# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Paystack payments

The contribution flow uses server-side Paystack transaction initialization and webhook verification. The browser never receives the Paystack secret key.

1. Create the Supabase tables/functions from `server/db/schema.sql`.
2. Copy `.env.example` to `.env` and fill in the server values.
3. Use a Paystack **test** secret key while developing.
4. Run the frontend with `npm run dev` and the API with `npm run server`.
5. Configure Paystack's webhook URL as `https://<your-api-host>/api/payments/webhook`.
6. Switch to the live secret key only after testing the complete payment lifecycle.


## Live wedding data and admin

Gift categories and raised amounts are loaded from `GET /api/gift-categories`. Raised totals are calculated from successful contributions in Supabase.

RSVP submissions are stored through `POST /api/rsvp` and can be reviewed from the admin dashboard.

The admin route remains `/admin`. The page now authenticates against the backend using `ADMIN_PASSCODE` and an HttpOnly signed session cookie. The signing secret is configured with `ADMIN_SESSION_SECRET`. Do not expose either value through a `VITE_` variable.

Admin API endpoints:
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/dashboard`

After adding the new migration, run the Supabase migrations before using RSVP/admin data. The migration also replaces the seeded gift-category Picsum URLs with bundled wedding images.

## Cloudflare deployment

The API is implemented behind a platform-neutral `Request -> Response` application in `server/app.ts`. The existing Node server is now only a local adapter, while `worker/index.ts` is the Cloudflare adapter. This keeps the payment, Supabase, validation, admin-auth, and routing logic shared between local Node development and Cloudflare Workers.

The Worker also serves the Vite `dist` output, so the site and API can be deployed together:

```bash
npm run deploy
```

For Cloudflare-local development:

```bash
cp .dev.vars.example .dev.vars
npm run build
npm run worker:dev
```

Configure the production secrets/variables (`PAYSTACK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSCODE`, `ADMIN_SESSION_SECRET`, etc.) in Cloudflare. Do not put these values in `VITE_*` variables.
