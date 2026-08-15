import type { PaymentProvider } from "../domain/payment-provider";
import type { PaymentProviderId } from "../domain/payment.types";
import { UnknownPaymentProviderError } from "../domain/payment.errors";
import { PaystackProvider } from "../providers/paystack/paystack.provider";

/**
 * Server-side environment shape this factory expects. Extend with
 * FLUTTERWAVE_SECRET_KEY, STRIPE_SECRET_KEY, etc. when new adapters
 * are added — the rest of the app never needs to change.
 */
export interface PaymentProviderEnv {
  PAYMENT_PROVIDER: PaymentProviderId;
  PAYSTACK_SECRET_KEY?: string;
  PAYSTACK_WEBHOOK_SECRET?: string;
}

/**
 * Resolves the active provider from configuration. This is the ONLY
 * place in the codebase that should branch on provider identity —
 * everywhere else depends on the `PaymentProvider` interface.
 */
export function createPaymentProvider(env: PaymentProviderEnv): PaymentProvider {
  switch (env.PAYMENT_PROVIDER) {
    case "paystack": {
      if (!env.PAYSTACK_SECRET_KEY || !env.PAYSTACK_WEBHOOK_SECRET) {
        throw new Error(
          "PAYSTACK_SECRET_KEY and PAYSTACK_WEBHOOK_SECRET must be set when PAYMENT_PROVIDER=paystack"
        );
      }
      return new PaystackProvider({
        secretKey: env.PAYSTACK_SECRET_KEY,
        webhookSecret: env.PAYSTACK_WEBHOOK_SECRET,
      });
    }
    // case "flutterwave": return new FlutterwaveProvider({ ... });
    // case "stripe": return new StripeProvider({ ... });
    default:
      throw new UnknownPaymentProviderError(env.PAYMENT_PROVIDER);
  }
}
