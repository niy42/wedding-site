export async function supabaseRequest(env, table, init = {}) {
    const supabaseUrl = env.SUPABASE_URL.replace(/\/$/, "");
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase environment is not configured");
    }
    const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
    for (const [key, value] of Object.entries(init.query ?? {})) {
        url.searchParams.set(key, value);
    }
    const headers = new Headers(init.headers);
    headers.set("apikey", serviceRoleKey);
    headers.set("Authorization", `Bearer ${serviceRoleKey}`);
    headers.set("Content-Type", "application/json");
    headers.set("Prefer", headers.get("Prefer") ?? "return=representation");
    const response = await fetch(url, { ...init, headers });
    const body = await response.text();
    if (!response.ok) {
        throw new Error(`Supabase request failed (${response.status}): ${body}`);
    }
    return body ? JSON.parse(body) : undefined;
}
