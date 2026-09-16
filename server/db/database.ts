/**
 * Minimal Supabase PostgREST client using Node's built-in fetch.
 * The service-role key is server-only and must never be exposed to Vite.
 */

const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set`);
  return value;
}

export async function supabaseRequest<T>(
  table: string,
  init: RequestInit & { query?: Record<string, string> } = {}
): Promise<T> {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(init.query ?? {})) url.searchParams.set(key, value);

  const headers = new Headers(init.headers);
  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  headers.set("Content-Type", "application/json");
  headers.set("Prefer", headers.get("Prefer") ?? "return=representation");

  const response = await fetch(url, { ...init, headers });
  const body = await response.text();
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${body}`);
  return body ? (JSON.parse(body) as T) : (undefined as T);
}
