import { DemoPayProvider } from "./demo-provider";
import { RazorpayTestProvider } from "./razorpay-provider";
import type { PaymentProvider } from "./payment-types";

export * from "./payment-types";
export * from "./demo-provider";
export * from "./razorpay-provider";

let defaultProviderInstance: PaymentProvider | null = null;

/**
 * Returns active payment provider.
 * Activates RazorpayTestProvider only if test credentials are provided;
 * otherwise defaults to DemoPayProvider.
 */
export function getPaymentProvider(): PaymentProvider {
  if (RazorpayTestProvider.isConfigured()) {
    return new RazorpayTestProvider();
  }

  if (!defaultProviderInstance) {
    defaultProviderInstance = new DemoPayProvider();
  }

  return defaultProviderInstance;
}
