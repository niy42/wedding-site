import type { PaymentProvider } from "../domain/payment-provider.js";
import type {
  InitializePaymentRequest,
  PaymentInitialization,
  PaymentVerification,
  PaymentWebhookRequest,
  NormalizedPaymentEvent,
} from "../domain/payment.types.js";

/**
 * Persistence boundary the service depends on. Implement this against
 * whatever the backend uses (Postgres/Supabase, etc.) — the service
 * itself stays storage-agnostic.
 */
export interface ContributionRepository {
  markPaymentCreated(reference: string, init: PaymentInitialization): Promise<void>;
  applyPaymentEvent(event: NormalizedPaymentEvent): Promise<void>;
}

/**
 * The domain/application layer. Everything here is provider-agnostic —
 * it only ever talks to `PaymentProvider` and `ContributionRepository`.
 */
export class PaymentService {
  private readonly provider: PaymentProvider;
  private readonly repository: ContributionRepository;

  constructor(provider: PaymentProvider, repository: ContributionRepository) {
    this.provider = provider;
    this.repository = repository;
  }

  async initialize(request: InitializePaymentRequest): Promise<PaymentInitialization> {
    const init = await this.provider.initializeTransaction(request);
    await this.repository.markPaymentCreated(request.reference, init);
    return init;
  }

  async verify(reference: string): Promise<PaymentVerification> {
    // Trust boundary: this is the ONLY source of truth for payment
    // success. The frontend success callback is a UX signal, never
    // a confirmation — this method (or the webhook path below) is
    // what actually records a contribution as paid.
    return this.provider.verifyTransaction(reference);
  }

  async processWebhook(request: PaymentWebhookRequest): Promise<{ accepted: boolean }> {
    const result = await this.provider.handleWebhook(request);

    if (!result.valid) {
      return { accepted: false };
    }

    if (!result.event) {
      // Valid signature, but not an event we act on (e.g. a
      // subscription event on an account also used for other things).
      return { accepted: true };
    }

    await this.repository.applyPaymentEvent(result.event);
    return { accepted: true };
  }
}
