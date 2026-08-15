export class PaymentError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "PaymentError";
    this.cause = cause;
  }
}

export class PaymentInitializationError extends PaymentError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "PaymentInitializationError";
  }
}

export class PaymentVerificationError extends PaymentError {
  constructor(message: string, cause?: unknown) {
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
  constructor(providerId: string) {
    super(`No payment provider registered for "${providerId}"`);
    this.name = "UnknownPaymentProviderError";
  }
}
