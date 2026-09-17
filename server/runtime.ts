export interface RateLimitBinding {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}

export interface AppEnv {
  PAYMENT_PROVIDER: "paystack";
  PAYSTACK_SECRET_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  APP_BASE_URL: string;
  CORS_ORIGINS: string;
  ADMIN_PASSCODE: string;
  ADMIN_SESSION_SECRET: string;
  NODE_ENV?: string;
  RATE_LIMITERS?: Partial<Record<"contribution" | "rsvp" | "initialize" | "verify" | "exchangeRates", RateLimitBinding>>;
}

export function requiredEnv(env: AppEnv, name: keyof AppEnv): string {
  const value = env[name];
  if (typeof value !== "string" || !value) {
    throw new Error(`${String(name)} must be set`);
  }
  return value;
}
