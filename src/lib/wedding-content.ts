import type { GalleryImage, GiftCategory, StoryMilestone, WeddingDetails } from "@/types";

/**
 * Theme identity: JossyAndrew2026 — Josephine & Andrew.
 * Placeholder content — replace with the real venues and copy before
 * launch. In production this should come from the admin-managed
 * content API rather than being hardcoded here.
 */
export const THEME_ID = "JossyAndrew2026";

export const weddingDetails: WeddingDetails = {
  partnerOneName: "Josephine",
  partnerTwoName: "Andrew",
  weddingDateISO: "2027-03-20T10:00:00+01:00",
  dressCode: "Black tie — deep jewel tones and aso-oke warmly welcomed",

  venue: {
    name: "Lion's Gate Hotel",
    address: "Along Kaduna Road, Keffi, Nasarawa State",
    mapUrl: "https://maps.google.com",
  },

  ceremony: {
    label: "Wedding Ceremony and Reception",
    officiatedBy: "The Redeemed Christian Church of God (RCCG)",
    startTimeISO: "2027-03-20T10:00:00+01:00",
  },

  reception: {
    label: "Reception",
    startTimeISO: "2027-03-20T17:00:00+01:00",
  },
};

export const storyMilestones: StoryMilestone[] = [
  {
    id: "meeting",
    year: "2021",
    title: "A chance introduction",
    body: "We met through mutual friends on a rainy Lagos evening that neither of us expected to remember — and haven't stopped talking since.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-story-1/900/1150",
  },
  {
    id: "distance",
    year: "2023",
    title: "Miles apart, closer than ever",
    body: "A season across two continents taught us what we already suspected: this was worth building a life around.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-story-2/900/1150",
  },
  {
    id: "proposal",
    year: "2025",
    title: "The question",
    body: "On the same street where we first met, under the same kind of rain, we said yes to forever.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-story-3/900/1150",
  },
];

export const galleryImages: GalleryImage[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `gallery-${i + 1}`,
  src: `https://picsum.photos/seed/jossyandrew-gallery-${i + 1}/1200/1500`,
  alt: `Photo ${i + 1} of Josephine and Andrew`,
  width: 1200,
  height: 1500,
}));

export const giftCategories: GiftCategory[] = [
  {
    id: "celebration",
    title: "The Celebration",
    description: "Help us bring the wedding day itself to life — flowers, music, and the little details that make it unforgettable.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-gift-celebration/900/700",
    target: { amountMinor: 300_000_00, currency: "NGN" },
    raised: { amountMinor: 96_500_00, currency: "NGN" },
  },
  {
    id: "honeymoon",
    title: "The Honeymoon",
    description: "Our first trip as a married couple — every gift here goes straight toward the adventure.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-gift-honeymoon/900/700",
    target: { amountMinor: 500_000_00, currency: "NGN" },
    raised: { amountMinor: 212_000_00, currency: "NGN" },
  },
  {
    id: "new-home",
    title: "Our New Home",
    description: "Setting up the place we'll build our life together, one room at a time.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-gift-home/900/700",
    target: { amountMinor: 400_000_00, currency: "NGN" },
    raised: { amountMinor: 58_000_00, currency: "NGN" },
  },
  {
    id: "blessing",
    title: "A General Blessing",
    description: "No specific goal — just a gift from your heart to celebrate our new chapter, however you'd like to bless it.",
    imageUrl: "https://picsum.photos/seed/jossyandrew-gift-blessing/900/700",
    raised: { amountMinor: 41_000_00, currency: "NGN" },
  },
];

export const suggestedAmountsMajor: Record<string, number[]> = {
  NGN: [10_000, 25_000, 50_000, 100_000],
  GBP: [25, 50, 100, 250],
  USD: [25, 50, 100, 250],
  EUR: [25, 50, 100, 250],
};
