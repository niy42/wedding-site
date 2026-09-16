import { UnknownPaymentProviderError } from "../domain/payment.errors.js";
import { PaystackProvider } from "../providers/paystack/paystack.provider.js";
/**
 * Resolves the active provider from configuration. This is the ONLY
 * place in the codebase that should branch on provider identity —
 * everywhere else depends on the `PaymentProvider` interface.
 */
export function createPaymentProvider(env) {
    switch (env.PAYMENT_PROVIDER) {
        case "paystack": {
            if (!env.PAYSTACK_SECRET_KEY) {
                throw new Error("PAYSTACK_SECRET_KEY must be set when PAYMENT_PROVIDER=paystack");
            }
            return new PaystackProvider({
                secretKey: env.PAYSTACK_SECRET_KEY,
            });
        }
        // case "flutterwave": return new FlutterwaveProvider({ ... });
        // case "stripe": return new StripeProvider({ ... });
        default:
            throw new UnknownPaymentProviderError(env.PAYMENT_PROVIDER);
    }
}
