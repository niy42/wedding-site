import type {
  ContributionRequest,
  PaymentInitializationResponse,
  RSVPFormValues,
  GiftCategory,
  AdminDashboard,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(body || response.statusText, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * The frontend only ever calls application-level endpoints
 * (/api/contributions, /api/payments/*). It has no knowledge of
 * which payment provider is configured on the backend.
 */
export const api = {
  submitRSVP: (values: RSVPFormValues) =>
    request<{ status: "created" | "duplicate" }>("/rsvp", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  createContribution: (contribution: ContributionRequest) =>
    request<{ contributionId: string; reference: string }>("/contributions", {
      method: "POST",
      body: JSON.stringify(contribution),
    }),

  initializePayment: (reference: string) =>
    request<PaymentInitializationResponse>("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({ reference }),
    }),

  verifyPayment: (reference: string) =>
    request<{ reference: string; status: string; amountMinor: number; currency: string; supporterName?: string }>(`/payments/${encodeURIComponent(reference)}`),

  getGiftCategories: () => request<GiftCategory[]>("/gift-categories"),

  adminLogin: (passcode: string) =>
    request<{ authenticated: true }>("/admin/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ passcode }),
    }),

  getAdminDashboard: () =>
    request<AdminDashboard>("/admin/dashboard", {
      credentials: "include",
    }),

  adminLogout: () =>
    request<void>("/admin/logout", {
      method: "POST",
      credentials: "include",
    }),
};

export { ApiError };
