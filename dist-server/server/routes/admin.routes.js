import { supabaseRequest } from "../db/database.js";
import { HttpError } from "./payment.routes.js";
import { clearAdminSessionCookie, createAdminSessionCookie, isAdminAuthenticated, verifyAdminPasscode } from "../lib/admin-auth.js";
export async function adminLogin(env, body) {
    if (!body || typeof body !== "object" || !(await verifyAdminPasscode(body.passcode, env))) {
        throw new HttpError(401, "Invalid admin credentials");
    }
    return { authenticated: true, setCookie: await createAdminSessionCookie(env) };
}
export function adminLogout() {
    return { authenticated: false, setCookie: clearAdminSessionCookie() };
}
export async function getAdminDashboard(request, env) {
    if (!(await isAdminAuthenticated(request, env)))
        throw new HttpError(401, "Admin authentication required");
    const [categories, contributions, rsvps] = await Promise.all([
        supabaseRequest(env, "gift_categories", { method: "GET", query: { select: "id,title,description,image_url,target_amount_minor,currency", order: "created_at.asc" } }),
        supabaseRequest(env, "contributions", { method: "GET", query: { select: "id,reference,category_id,amount_minor,currency,supporter_name,supporter_email,supporter_phone,supporter_message,is_anonymous,is_public,payment_provider,provider_reference,payment_status,paid_at,created_at", order: "created_at.desc" } }),
        supabaseRequest(env, "rsvps", { method: "GET", query: { select: "id,full_name,email,phone,attending,guest_count,guest_names,dietary_notes,note,created_at", order: "created_at.desc" } }),
    ]);
    const categoryMap = new Map(categories.map((category) => [category.id, category]));
    const successful = contributions.filter((item) => item.payment_status === "SUCCESSFUL");
    const totalMinor = successful.reduce((sum, item) => sum + Number(item.amount_minor), 0);
    return {
        totals: { amountMinor: totalMinor, currency: "NGN" },
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
