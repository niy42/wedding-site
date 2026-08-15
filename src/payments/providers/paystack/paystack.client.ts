/**
 * Server-side only. This module must never be imported from
 * frontend/browser code — it expects `PAYSTACK_SECRET_KEY` to be
 * present, which is only ever set in the backend environment.
 */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface PaystackClientConfig {
  secretKey: string;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    id: number;
    metadata: unknown;
  };
}

export class PaystackClient {
  private readonly config: PaystackClientConfig;

  constructor(config: PaystackClientConfig) {
    this.config = config;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Paystack request failed (${response.status}): ${body}`);
    }

    return (await response.json()) as T;
  }

  initializeTransaction(params: {
    email: string;
    amount: number;
    currency: string;
    reference: string;
    callback_url: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.request<PaystackInitializeResponse>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  verifyTransaction(reference: string) {
    return this.request<PaystackVerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );
  }
}

export type { PaystackInitializeResponse, PaystackVerifyResponse };
