import type {
  InitializePaymentRequest,
  PaymentInitialization,
  PaymentVerification,
  PaymentWebhookRequest,
  PaymentWebhookResult,
  PaymentProviderId,
} from "./payment.types";

/**
 * Contract every payment provider adapter must satisfy.
 *
 * The domain/service layer depends only on this interface — never on a
 * concrete provider. Swapping Paystack for Flutterwave means writing a
 * new adapter that implements this contract and registering it in the
 * provider factory; nothing else in the app should need to change.
 */
export interface PaymentProvider {
  readonly id: PaymentProviderId;

  initializeTransaction(
    request: InitializePaymentRequest
  ): Promise<PaymentInitialization>;

  verifyTransaction(reference: string): Promise<PaymentVerification>;

  handleWebhook(request: PaymentWebhookRequest): Promise<PaymentWebhookResult>;
}
