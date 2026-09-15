export class PaymentError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.name = "PaymentError";
        this.cause = cause;
    }
}
export class PaymentInitializationError extends PaymentError {
    constructor(message, cause) {
        super(message, cause);
        this.name = "PaymentInitializationError";
    }
}
export class PaymentVerificationError extends PaymentError {
    constructor(message, cause) {
        super(message, cause);
        this.name = "PaymentVerificationError";
    }
}
export class InvalidWebhookSignatureError extends PaymentError {
    constructor(message = "Webhook signature could not be verified") {
        super(message);
        this.name = "InvalidWebhookSignatureError";
    }
}
export class UnknownPaymentProviderError extends PaymentError {
    constructor(providerId) {
        super(`No payment provider registered for "${providerId}"`);
        this.name = "UnknownPaymentProviderError";
    }
}
