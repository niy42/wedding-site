import type { GalleryImage, GiftCategory, StoryMilestone, WeddingDetails } from "@/types";

/**
 * Placeholder content — replace with the real names, date, venues,
 * and copy before launch. In production this should come from the
 * admin-managed content API rather than being hardcoded here.
 */
export const weddingDetails: WeddingDetails = {
  partnerOneName: "Niyi",
  partnerTwoName: "Amara",
  weddingDateISO: "2027-03-20T13:00:00+01:00",
  dressCode: "Garden formal — aso-oke and jewel tones welcome",
  ceremony: {
    label: "Ceremony",
    venueName: "St. Saviour's Church",
    address: "12 Ikoyi Crescent, Lagos, Nigeria",
    startTimeISO: "2027-03-20T13:00:00+01:00",
    mapUrl: "https://maps.google.com",
  },
  reception: {
    label: "Reception",
    venueName: "The Terrace, Eko Hotel",
    address: "Adetokunbo Ademola Street, Victoria Island, Lagos",
    startTimeISO: "2027-03-20T17:00:00+01:00",
    mapUrl: "https://maps.google.com",
  },
};

export const storyMilestones: StoryMilestone[] = [
  {
    id: "meeting",
    year: "2021",
    title: "A chance introduction",
    body: "We met through mutual friends on a rainy Lagos evening that neither of us expected to remember — and haven't stopped talking since.",
    imageUrl: "https://picsum.photos/seed/wedding-story-1/800/1000",
  },
  {
    id: "distance",
    year: "2023",
    title: "Miles apart, closer than ever",
    body: "A season across two continents taught us what we already suspected: this was worth building a life around.",
    imageUrl: "https://picsum.photos/seed/wedding-story-2/800/1000",
  },
  {
    id: "proposal",
    year: "2025",
    title: "The question",
    body: "On the same street where we first met, under the same kind of rain, we said yes to forever.",
    imageUrl: "https://picsum.photos/seed/wedding-story-3/800/1000",
  },
];

export const galleryImages: GalleryImage[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `gallery-${i + 1}`,
  src: `https://picsum.photos/seed/wedding-gallery-${i + 1}/1200/1500`,
  alt: `Photo ${i + 1} of the couple`,
  width: 1200,
  height: 1500,
}));

export const giftCategories: GiftCategory[] = [
  {
    id: "celebration",
    title: "The Celebration",
    description: "Help us bring the wedding day itself to life — flowers, music, and the little details that make it unforgettable.",
    imageUrl: "https://picsum.photos/seed/wedding-gift-celebration/800/600",
    target: { amountMinor: 300_000_00, currency: "NGN" },
    raised: { amountMinor: 96_500_00, currency: "NGN" },
  },
  {
    id: "honeymoon",
    title: "The Honeymoon",
    description: "Our first trip as a married couple — every gift here goes straight toward the adventure.",
    imageUrl: "https://picsum.photos/seed/wedding-gift-honeymoon/800/600",
    target: { amountMinor: 500_000_00, currency: "NGN" },
    raised: { amountMinor: 212_000_00, currency: "NGN" },
  },
  {
    id: "new-home",
    title: "Our New Home",
    description: "Setting up the place we'll build our life together, one room at a time.",
    imageUrl: "https://picsum.photos/seed/wedding-gift-home/800/600",
    target: { amountMinor: 400_000_00, currency: "NGN" },
    raised: { amountMinor: 58_000_00, currency: "NGN" },
  },
  {
    id: "blessing",
    title: "A General Blessing",
    description: "No specific goal — just a gift from your heart to celebrate our new chapter, however you'd like to bless it.",
    imageUrl: "https://picsum.photos/seed/wedding-gift-blessing/800/600",
    raised: { amountMinor: 41_000_00, currency: "NGN" },
  },
];

export const suggestedAmountsMajor: Record<string, number[]> = {
  NGN: [10_000, 25_000, 50_000, 100_000],
  GBP: [25, 50, 100, 250],
  USD: [25, 50, 100, 250],
  EUR: [25, 50, 100, 250],
};
