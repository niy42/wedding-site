import { randomUUID } from "node:crypto";

import { supabaseRequest } from "../db/database.js";
import {
  parseContributionInput,
  parseReference,
} from "../lib/validation.js";

import {
  createPaymentProvider,
} from "../payments/services/payment-provider.factory.js";

import {
  PaymentService,
  type ContributionRepository,
} from "../payments/services/payment.service.js";

import type {
  InitializePaymentRequest,
  NormalizedPaymentEvent,
} from "../payments/domain/payment.types.js";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set`);
  }

  return value;
}

const provider = createPaymentProvider({
  PAYMENT_PROVIDER: (process.env.PAYMENT_PROVIDER ?? "paystack") as "paystack",
  PAYSTACK_SECRET_KEY: requiredEnv("PAYSTACK_SECRET_KEY"),
});

const paymentService = new PaymentService(
  provider,
  createContributionRepository(),
);

function createReference(): string {
  return `gift_${randomUUID().replaceAll("-", "")}`;
}

function createContributionRepository(): ContributionRepository {
  return {
    async markPaymentCreated(reference, init) {
      await supabaseRequest("contributions", {
        method: "PATCH",
        query: {
          reference: `eq.${reference}`,
        },
        body: JSON.stringify({
          payment_provider: init.provider,
          provider_reference: init.providerReference,
          provider_access_code: init.providerAccessCode ?? null,
          checkout_url: init.checkoutUrl ?? null,
          payment_status: init.status,
          initialization_started_at: null,
          updated_at: new Date().toISOString(),
        }),
      });
    },

    async applyPaymentEvent(event: NormalizedPaymentEvent) {
      await supabaseRequest("rpc/process_payment_event", {
        method: "POST",
        body: JSON.stringify({
          p_provider: event.provider,
          p_event_type: "charge.success",
          p_idempotency_key: event.idempotencyKey,
          p_reference: event.reference,
          p_provider_reference: event.providerReference,
          p_status: event.status,
          p_amount_minor: event.money.amountMinor,
          p_currency: event.money.currency,
          p_occurred_at: event.occurredAt,
          p_payload: event.rawPayload ?? event,
        }),
      });
    },
  };
}

export async function createContribution(
  body: unknown,
) {
  const input = parseContributionInput(body);

  const categories = await supabaseRequest<Array<{ id: string }>>(
    "gift_categories",
    {
      method: "GET",
      query: {
        id: `eq.${input.categoryId}`,
        is_active: "eq.true",
        select: "id",
        limit: "1",
      },
    },
  );

  if (categories.length === 0) {
    throw new HttpError(400, "Invalid gift category");
  }

  const contributionId = randomUUID();
  const reference = createReference();

  await supabaseRequest("contributions", {
    method: "POST",
    body: JSON.stringify({
      id: contributionId,
      reference,
      category_id: input.categoryId,
      amount_minor: input.money.amountMinor,
      currency: input.money.currency,
      supporter_name: input.supporter.name,
      supporter_email: input.supporter.email,
      supporter_phone: input.supporter.phone ?? null,
      supporter_message: input.supporter.message ?? null,
      is_anonymous: input.supporter.isAnonymous ?? false,
      is_public: input.supporter.isPublic ?? true,
    }),
  });

  return {
    contributionId,
    reference,
  };
}

export async function initializePayment(
  rawReference: unknown,
) {
  const reference = parseReference(rawReference);

  const claimed = await supabaseRequest<
    {
      reference: string;
      amount_minor: number;
      currency: "NGN";
      supporter_email: string;
      supporter_name: string;
      category_id: string;
      payment_status: string;
      checkout_url: string | null;
    }
  >("rpc/claim_payment_initialization", {
    method: "POST",
    body: JSON.stringify({
      p_reference: reference,
    }),
  });

  // if (claimed.length === 0) {
  //   throw new HttpError(404, "Contribution not found");
  // }

  const row = claimed;

  if (row.payment_status === "SUCCESSFUL") {
    throw new HttpError(409, "Contribution is already paid");
  }

  if (
    row.checkout_url &&
    row.payment_status === "PENDING"
  ) {
    return {
      reference,
      checkoutUrl: row.checkout_url,
      provider: "paystack" as const,
    };
  }

  const request: InitializePaymentRequest = {
    reference: row.reference,
    money: {
      amountMinor: Number(row.amount_minor),
      currency: row.currency,
    },
    customerEmail: row.supporter_email,
    customerName: row.supporter_name,
    callbackUrl: `${requiredEnv("APP_BASE_URL")}/gift/thank-you`,
    metadata: {
      contribution_id: row.reference,
      category_id: row.category_id,
    },
  };

  try {
    const init = await paymentService.initialize(request);

    return {
      reference: init.reference,
      checkoutUrl: init.checkoutUrl,
      provider: init.provider,
    };
  } catch (error) {
    await supabaseRequest("contributions", {
      method: "PATCH",
      query: {
        reference: `eq.${reference}`,
      },
      body: JSON.stringify({
        payment_status: "CREATED",
        initialization_started_at: null,
        updated_at: new Date().toISOString(),
      }),
    }).catch(() => undefined);

    throw error;
  }
}

export async function verifyPayment(
  rawReference: unknown,
) {
  const reference = parseReference(rawReference);

  const rows = await supabaseRequest<
    Array<{
      amount_minor: number;
      currency: string;
    }>
  >("contributions", {
    method: "GET",
    query: {
      reference: `eq.${reference}`,
      select: "amount_minor,currency",
      limit: "1",
    },
  });

  if (rows.length === 0) {
    throw new HttpError(404, "Payment not found");
  }

  const verification = await paymentService.verify(reference);
  const expected = rows[0];

  if (verification.reference !== reference) {
    throw new HttpError(
      409,
      "Payment reference could not be verified",
    );
  }

  if (
    verification.money.amountMinor !== Number(expected.amount_minor) ||
    verification.money.currency !== expected.currency
  ) {
    throw new HttpError(
      409,
      "Payment amount or currency could not be verified",
    );
  }

  if (verification.status === "SUCCESSFUL") {
    await supabaseRequest("contributions", {
      method: "PATCH",
      query: {
        reference: `eq.${reference}`,
      },
      body: JSON.stringify({
        payment_provider: verification.provider,
        provider_reference: verification.providerReference,
        payment_status: "SUCCESSFUL",
        paid_at:
          verification.paidAt ??
          new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  }

  return {
    reference,
    status: verification.status,
    amountMinor: verification.money.amountMinor,
    currency: verification.money.currency,
  };
}

export async function handlePaystackWebhook(
  rawBody: string,
  headers: Record<string, string>,
) {
  return paymentService.processWebhook({
    rawBody,
    headers,
  });
}

export class HttpError extends Error {
  readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.status = status;
  }
}