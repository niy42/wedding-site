import type { PaymentProvider } from "../../domain/payment-provider";
import type {
  InitializePaymentRequest,
  PaymentInitialization,
  PaymentVerification,
  PaymentWebhookRequest,
  PaymentWebhookResult,
} from "../../domain/payment.types";
import {
  PaymentInitializationError,
  PaymentVerificationError,
} from "../../domain/payment.errors";
import { PaystackClient } from "./paystack.client";
import { mapPaystackStatus, paystackAmountToMoney } from "./paystack.mapper";
import {
  parsePaystackWebhookBody,
  verifyPaystackSignature,
} from "./paystack.webhook";

export interface PaystackProviderConfig {
  secretKey: string;
  webhookSecret: string;
}

/**
 * All Paystack-specific behavior lives here and in the sibling
 * client/mapper/webhook modules. Nothing outside this folder should
 * know Paystack exists.
 */
export class PaystackProvider implements PaymentProvider {
  readonly id = "paystack" as const;
  private readonly client: PaystackClient;
  private readonly config: PaystackProviderConfig;

  constructor(config: PaystackProviderConfig) {
    this.config = config;
    this.client = new PaystackClient({ secretKey: config.secretKey });
  }

  async initializeTransaction(
    request: InitializePaymentRequest
  ): Promise<PaymentInitialization> {
    try {
      const response = await this.client.initializeTransaction({
        email: request.customerEmail,
        amount: request.money.amountMinor,
        currency: request.money.currency,
        reference: request.reference,
        callback_url: request.callbackUrl,
        metadata: request.metadata,
      });

      return {
        reference: request.reference,
        checkoutUrl: response.data.authorization_url,
        provider: this.id,
        providerReference: response.data.reference,
        status: "PENDING",
      };
    } catch (error) {
      throw new PaymentInitializationError(
        "Failed to initialize Paystack transaction",
        error
      );
    }
  }

  async verifyTransaction(reference: string): Promise<PaymentVerification> {
    try {
      const response = await this.client.verifyTransaction(reference);
      const { data } = response;

      return {
        reference: data.reference,
        providerReference: String(data.id),
        provider: this.id,
        status: mapPaystackStatus(data.status),
        money: paystackAmountToMoney(data.amount, data.currency),
        paidAt: data.paid_at ?? undefined,
        raw: data,
      };
    } catch (error) {
      throw new PaymentVerificationError(
        `Failed to verify Paystack transaction ${reference}`,
        error
      );
    }
  }

  async handleWebhook(request: PaymentWebhookRequest): Promise<PaymentWebhookResult> {
    const signature = request.headers["x-paystack-signature"];
    const valid = verifyPaystackSignature(
      request.rawBody,
      signature,
      this.config.webhookSecret
    );

    if (!valid) {
      return { valid: false, reason: "Invalid Paystack webhook signature" };
    }

    const body = parsePaystackWebhookBody(request.rawBody);

    // We only care about charge lifecycle events for contributions.
    if (body.event !== "charge.success" && !body.event.startsWith("charge.")) {
      return { valid: true, reason: `Ignored event type: ${body.event}` };
    }

    return {
      valid: true,
      event: {
        reference: body.data.reference,
        providerReference: String(body.data.id),
        provider: this.id,
        status: mapPaystackStatus(body.data.status),
        money: paystackAmountToMoney(body.data.amount, body.data.currency),
        occurredAt: body.data.paid_at ?? new Date().toISOString(),
        // Paystack event id (data.id) is the natural idempotency key —
        // the same charge always reports the same id, even on retry.
        idempotencyKey: `paystack:${body.data.id}`,
      },
    };
  }
}
