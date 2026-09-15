/**
 * The domain/application layer. Everything here is provider-agnostic —
 * it only ever talks to `PaymentProvider` and `ContributionRepository`.
 */
export class PaymentService {
    provider;
    repository;
    constructor(provider, repository) {
        this.provider = provider;
        this.repository = repository;
    }
    async initialize(request) {
        const init = await this.provider.initializeTransaction(request);
        await this.repository.markPaymentCreated(request.reference, init);
        return init;
    }
    async verify(reference) {
        // Trust boundary: this is the ONLY source of truth for payment
        // success. The frontend success callback is a UX signal, never
        // a confirmation — this method (or the webhook path below) is
        // what actually records a contribution as paid.
        return this.provider.verifyTransaction(reference);
    }
    async processWebhook(request) {
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
