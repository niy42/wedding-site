export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export interface Money {
  amountMinor: number;
  currency: Currency;
}

export interface WeddingDetails {
  partnerOneName: string;
  partnerTwoName: string;
  weddingDateISO: string;
  ceremony: EventDetails;
  reception: EventDetails;
  dressCode: string;
}

export interface EventDetails {
  label: string;
  venueName: string;
  address: string;
  startTimeISO: string;
  mapUrl?: string;
}

export interface StoryMilestone {
  id: string;
  year: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface RSVPFormValues {
  fullName: string;
  email: string;
  phone?: string;
  attending: "yes" | "no";
  guestCount: number;
  guestNames?: string[];
  dietaryNotes?: string;
  note?: string;
}

export type RSVPSubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

export interface GiftCategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  target?: Money;
  raised: Money;
}

export interface ContributionSupporterInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  isAnonymous: boolean;
  isPublic: boolean;
}

export interface ContributionRequest {
  categoryId: string;
  money: Money;
  supporter: ContributionSupporterInfo;
}

export interface PaymentInitializationResponse {
  reference: string;
  checkoutUrl?: string;
  provider: string;
}
