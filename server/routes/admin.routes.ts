import { supabaseRequest } from "../db/database.js";
import type { AppEnv } from "../runtime.js";
import { HttpError } from "./payment.routes.js";
import { clearAdminSessionCookie, createAdminSessionCookie, isAdminAuthenticated, verifyAdminPasscode } from "../lib/admin-auth.js";

type CategoryRow = { id: string; title: string; description: string; image_url: string | null; target_amount_minor: number | null; currency: "NGN" };
type ContributionRow = { id: string; reference: string; category_id: string; amount_minor: number; currency: "NGN"; supporter_name: string; supporter_email: string; supporter_phone: string | null; supporter_message: string | null; is_anonymous: boolean; is_public: boolean; payment_provider: string | null; provider_reference: string | null; payment_status: string; paid_at: string | null; created_at: string };
type RSVPRow = { id: string; full_name: string; email: string; phone: string | null; attending: "yes" | "no"; guest_count: number; guest_names: string[] | null; dietary_notes: string | null; note: string | null; created_at: string };

export async function adminLogin(env: AppEnv, body: unknown) {
  if (!body || typeof body !== "object" || !(await verifyAdminPasscode((body as Record<string, unknown>).passcode, env))) {
    throw new HttpError(401, "Invalid admin credentials");
  }
  return { authenticated: true as const, setCookie: await createAdminSessionCookie(env) };
}

export function adminLogout() {
  return { authenticated: false as const, setCookie: clearAdminSessionCookie() };
}

export async function getAdminDashboard(request: Request, env: AppEnv) {
  if (!(await isAdminAuthenticated(request, env))) throw new HttpError(401, "Admin authentication required");
  const [categories, contributions, rsvps] = await Promise.all([
    supabaseRequest<CategoryRow[]>(env, "gift_categories", { method: "GET", query: { select: "id,title,description,image_url,target_amount_minor,currency", order: "created_at.asc" } }),
    supabaseRequest<ContributionRow[]>(env, "contributions", { method: "GET", query: { select: "id,reference,category_id,amount_minor,currency,supporter_name,supporter_email,supporter_phone,supporter_message,is_anonymous,is_public,payment_provider,provider_reference,payment_status,paid_at,created_at", order: "created_at.desc" } }),
    supabaseRequest<RSVPRow[]>(env, "rsvps", { method: "GET", query: { select: "id,full_name,email,phone,attending,guest_count,guest_names,dietary_notes,note,created_at", order: "created_at.desc" } }),
  ]);
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const successful = contributions.filter((item) => item.payment_status === "SUCCESSFUL");
  const totalMinor = successful.reduce((sum, item) => sum + Number(item.amount_minor), 0);
  return {
    totals: { amountMinor: totalMinor, currency: "NGN" as const },
    contributorCount: successful.length,
    rsvpCount: rsvps.length,
    attendingGuestCount: rsvps.filter((rsvp) => rsvp.attending === "yes").reduce((sum, rsvp) => sum + Number(rsvp.guest_count), 0),
    categories: categories.map((category) => ({
      id: category.id, title: category.title, description: category.description, imageUrl: category.image_url ?? "",
      target: category.target_amount_minor == null ? undefined : { amountMinor: Number(category.target_amount_minor), currency: category.currency },
      raised: { amountMinor: successful.filter((item) => item.category_id === category.id).reduce((sum, item) => sum + Number(item.amount_minor), 0), currency: category.currency },
    })),
    contributions: contributions.map((item) => ({
      id: item.id, reference: item.reference, categoryId: item.category_id, categoryTitle: categoryMap.get(item.category_id)?.title ?? "Unknown category",
      amount: { amountMinor: Number(item.amount_minor), currency: item.currency }, supporterName: item.supporter_name, supporterEmail: item.supporter_email,
      supporterPhone: item.supporter_phone ?? undefined, supporterMessage: item.supporter_message ?? undefined, isAnonymous: item.is_anonymous, isPublic: item.is_public,
      paymentProvider: item.payment_provider ?? undefined, providerReference: item.provider_reference ?? undefined, paymentStatus: item.payment_status, paidAt: item.paid_at ?? undefined, createdAt: item.created_at,
    })),
    rsvps: rsvps.map((item) => ({ id: item.id, fullName: item.full_name, email: item.email, phone: item.phone ?? undefined, attending: item.attending, guestCount: Number(item.guest_count), guestNames: item.guest_names ?? undefined, dietaryNotes: item.dietary_notes ?? undefined, note: item.note ?? undefined, createdAt: item.created_at })),
  };
}
