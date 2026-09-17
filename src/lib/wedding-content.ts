import { ChurchEnvNoColor, Golden, HomeKeffTwo, IkomDress, IntroHome, Proposal, ProposalHands, ProposalHandsLove, ProposalTwo } from "@/assets";
import type { GalleryImage, StoryMilestone, WeddingDetails } from "@/types";


/**
 * Static wedding content. The current backend does not expose a content-management
 * endpoint for these fields, so they remain application content rather than mock API data.
 */
export const THEME_ID = "JossyAndrew2026";

export const weddingDetails: WeddingDetails = {
  partnerOneName: "Josephine",
  partnerTwoName: "Andrew",
  weddingDateISO: "2027-05-08T10:00:00+01:00",
  dressCode: "Black tie — deep jewel tones and aso-oke warmly welcomed",

  venue: {
    name: "The Redeemed Christian Church of God (RCCG ERP)",
    address: "Area Command Keffi, Nasarawa State",
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
    imageUrl: ProposalTwo,
  },
  {
    id: "distance",
    year: "2023",
    title: "Miles apart, closer than ever",
    body: "A season across two continents taught us what we already suspected: this was worth building a life around.",
    imageUrl: ProposalHands,
  },
  {
    id: "proposal",
    year: "2025",
    title: "The question",
    body: "On the same street where we first met, under the same kind of rain, we said yes to forever.",
    imageUrl: ProposalHandsLove,
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "gallery-1",
    src: IntroHome,
    alt: "Photo 1 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },
  {
    id: "gallery-2",
    src: IkomDress,
    alt: "Photo 2 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },
  {
    id: "gallery-3",
    src: Golden,
    alt: "Photo 3 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },
  {
    id: "gallery-4",
    src: Proposal,
    alt: "Photo 4 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },

  {
    id: "gallery-5",
    src: HomeKeffTwo,
    alt: "Photo 5 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },
  {
    id: "gallery-6",
    src: ChurchEnvNoColor,
    alt: "Photo 6 of Josephine and Andrew",
    width: 1200,
    height: 1500,
  },

];

export const suggestedAmountsMajor: Record<string, number[]> = {
  NGN: [10_000, 25_000, 50_000, 100_000],
  GBP: [25, 50, 100, 250],
  USD: [25, 50, 100, 250],
  EUR: [25, 50, 100, 250],
};
