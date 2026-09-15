import { supabaseRequest } from "../db/database.js";
import { HttpError } from "./payment.routes.js";

type GiftCategoryRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  target_amount_minor: number | null;
  currency: "NGN";
};

type ContributionRow = {
  category_id: string;
  amount_minor: number;
};

export async function getGiftCategories() {
  const [categories, contributions] = await Promise.all([
    supabaseRequest<GiftCategoryRow[]>("gift_categories", {
      method: "GET",
      query: {
        is_active: "eq.true",
        select: "id,title,description,image_url,target_amount_minor,currency",
        order: "created_at.asc",
      },
    }),
    supabaseRequest<ContributionRow[]>("contributions", {
      method: "GET",
      query: {
        payment_status: "eq.SUCCESSFUL",
        select: "category_id,amount_minor",
      },
    }),
  ]);

  const raisedByCategory = new Map<string, number>();
  for (const contribution of contributions) {
    raisedByCategory.set(
      contribution.category_id,
      (raisedByCategory.get(contribution.category_id) ?? 0) + Number(contribution.amount_minor),
    );
  }

  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    description: category.description,
    imageUrl: category.image_url ?? "",
    target: category.target_amount_minor == null
      ? undefined
      : { amountMinor: Number(category.target_amount_minor), currency: category.currency },
    raised: {
      amountMinor: raisedByCategory.get(category.id) ?? 0,
      currency: category.currency,
    },
  }));
}

type RSVPInput = {
  fullName: string;
  email: string;
  phone?: string;
  attending: "yes" | "no";
  guestCount: number;
  guestNames?: string[];
  dietaryNotes?: string;
  note?: string;
};

function parseRSVP(body: unknown): RSVPInput {
  if (!body || typeof body !== "object") throw new HttpError(400, "Invalid RSVP payload");
  const value = body as Record<string, unknown>;
  if (
    typeof value.fullName !== "string" ||
    typeof value.email !== "string" ||
    (value.attending !== "yes" && value.attending !== "no") ||
    typeof value.guestCount !== "number" ||
    !Number.isInteger(value.guestCount) ||
    value.guestCount < 0 ||
    value.guestCount > 10
  ) {
    throw new HttpError(400, "Invalid RSVP payload");
  }

  return {
    fullName: value.fullName.trim(),
    email: value.email.trim().toLowerCase(),
    phone: typeof value.phone === "string" ? value.phone.trim() || undefined : undefined,
    attending: value.attending,
    guestCount: value.attending === "yes" ? value.guestCount : 0,
    guestNames: Array.isArray(value.guestNames)
      ? value.guestNames.filter((name): name is string => typeof name === "string").slice(0, 10)
      : undefined,
    dietaryNotes: typeof value.dietaryNotes === "string" ? value.dietaryNotes.trim() || undefined : undefined,
    note: typeof value.note === "string" ? value.note.trim() || undefined : undefined,
  };
}

export async function createRSVP(body: unknown) {
  const input = parseRSVP(body);
  const existing = await supabaseRequest<Array<{ id: string }>>("rsvps", {
    method: "GET",
    query: { email: `eq.${input.email}`, select: "id", limit: "1" },
  });

  if (existing.length > 0) return { status: "duplicate" as const };

  await supabaseRequest("rsvps", {
    method: "POST",
    body: JSON.stringify({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone ?? null,
      attending: input.attending,
      guest_count: input.guestCount,
      guest_names: input.guestNames ?? [],
      dietary_notes: input.dietaryNotes ?? null,
      note: input.note ?? null,
    }),
  });

  return { status: "created" as const };
}
