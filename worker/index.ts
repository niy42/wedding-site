import { app } from "../server/app.js";
import type { AppEnv, RateLimitBinding } from "../server/runtime.js";

type WorkerEnv = AppEnv & {
  ASSETS: Fetcher;
  CONTRIBUTION_RATE_LIMITER?: RateLimitBinding;
  RSVP_RATE_LIMITER?: RateLimitBinding;
  INITIALIZE_RATE_LIMITER?: RateLimitBinding;
  VERIFY_RATE_LIMITER?: RateLimitBinding;
  EXCHANGE_RATES_RATE_LIMITER?: RateLimitBinding;
};

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/") && url.pathname !== "/health") {
      return env.ASSETS.fetch(request);
    }
    return app(request, {
      ...env,
      RATE_LIMITERS: {
        contribution: env.CONTRIBUTION_RATE_LIMITER,
        rsvp: env.RSVP_RATE_LIMITER,
        initialize: env.INITIALIZE_RATE_LIMITER,
        verify: env.VERIFY_RATE_LIMITER,
        exchangeRates: env.EXCHANGE_RATES_RATE_LIMITER,
      },
    });
  },
};
