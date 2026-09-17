import type { PaymentProvider } from "../../domain/payment-provider.js";
import type {
  InitializePaymentRequest,
  PaymentInitialization,
  PaymentVerification,
  PaymentWebhookRequest,
  PaymentWebhookResult,
} from "../../domain/payment.types.js";
import {
  PaymentInitializationError,
  PaymentVerificationError,
} from "../../domain/payment.errors.js";
import { PaystackClient } from "./paystack.client.js";
import { mapPaystackStatus, paystackAmountToMoney } from "./paystack.mapper.js";
import { normalizePaystackWebhook } from "./paystack.webhook.js";

export interface PaystackProviderConfig {
  secretKey: string;
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

      if (!response.status || !response.data.authorization_url || !response.data.access_code || response.data.reference !== request.reference) {
        throw new Error("Paystack returned an invalid initialization response");
      }

      return {
        reference: request.reference,
        provider: this.id,
        providerReference: response.data.reference,
        providerAccessCode: response.data.access_code,
        checkoutUrl: response.data.authorization_url,
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
      if (!response.status || !response.data?.reference || response.data.reference !== reference) {
        throw new Error("Paystack returned an invalid verification response");
      }
      const { data } = response;

      return {
        reference: data.reference,
        providerReference: String(data.id),
        provider: this.id,
        status: mapPaystackStatus(data.status),
        money: paystackAmountToMoney(
          data.requested_amount ?? data.amount,
          data.currency,
        ),
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
    return await normalizePaystackWebhook(
      request.rawBody,
      request.headers["x-paystack-signature"],
      this.config.secretKey
    );
  }
}
