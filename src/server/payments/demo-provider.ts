import crypto from "node:crypto";
import type {
  CreateOrderParams,
  OrderResult,
  PaymentProvider,
  RefundParams,
  RefundResult,
  VerifyPaymentParams,
  VerifyResult,
} from "./payment-types";

import {
  DEMO_TEST_CARDS,
  DEMO_TEST_UPIS,
  isAllowedDemoCard,
  validateDemoCardSafety,
  passesLuhnCheck,
} from "./card-validator";

export {
  DEMO_TEST_CARDS,
  DEMO_TEST_UPIS,
  isAllowedDemoCard,
  validateDemoCardSafety,
  passesLuhnCheck,
};

/**
 * Generate HMAC-SHA256 signature for server-side payment verification.
 */
export function generateDemoSignature(
  orderId: string,
  paymentId: string,
  amount: number,
  secret = process.env["DEMO_PAY_SECRET"] || "smarttrip-demo-secret-salt-2026",
): string {
  const payload = `${orderId}|${paymentId}|${amount}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify HMAC-SHA256 signature.
 */
export function verifyDemoSignature(
  orderId: string,
  paymentId: string,
  amount: number,
  signature: string,
  secret = process.env["DEMO_PAY_SECRET"] || "smarttrip-demo-secret-salt-2026",
): boolean {
  const expected = generateDemoSignature(orderId, paymentId, amount, secret);
  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
}

export class DemoPayProvider implements PaymentProvider {
  name = "DemoPay Gateway";
  isTestMode = true;

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const randomHex = crypto.randomBytes(6).toString("hex");
    const orderId = `demo_ord_${randomHex}`;

    return {
      orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      provider: "demo",
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyResult> {
    const { orderId, paymentId, amount, signature, method = "card" } = params;

    // 1. Verify cryptographic signature
    let isValidSignature = false;
    try {
      isValidSignature = verifyDemoSignature(orderId, paymentId, amount, signature);
    } catch {
      isValidSignature = false;
    }

    if (!isValidSignature) {
      return {
        success: false,
        paymentId,
        orderId,
        status: "failed",
        method,
        message: "Cryptographic signature verification failed. Invalid demo token.",
        transactionRef: `tx_failed_${paymentId}`,
      };
    }

    // 2. Validate Card Safety: Refuse real card numbers
    if (method === "card" && params.cardDetails?.cardNumber) {
      validateDemoCardSafety(params.cardDetails.cardNumber);
      const cleaned = params.cardDetails.cardNumber.replace(/[\s-]/g, "");

      if (cleaned === DEMO_TEST_CARDS.DECLINED) {
        return {
          success: false,
          paymentId,
          orderId,
          status: "failed",
          method,
          message: "Simulated Decline: Transaction declined by issuing bank (Test Card).",
          transactionRef: `tx_declined_${paymentId}`,
        };
      }

      if (cleaned === DEMO_TEST_CARDS.INSUFFICIENT_FUNDS) {
        return {
          success: false,
          paymentId,
          orderId,
          status: "failed",
          method,
          message: "Simulated Decline: Insufficient account funds (Test Card).",
          transactionRef: `tx_insufficient_${paymentId}`,
        };
      }

      if (cleaned === DEMO_TEST_CARDS.PENDING) {
        return {
          success: false,
          paymentId,
          orderId,
          status: "pending",
          method,
          message: "Simulated Pending: Bank payment authentication pending OTP (Test Card).",
          transactionRef: `tx_pending_${paymentId}`,
        };
      }
    }

    // 3. Handle UPI
    if (method === "upi" && params.upiDetails?.vpa) {
      const vpa = params.upiDetails.vpa.toLowerCase().trim();
      if (vpa === DEMO_TEST_UPIS.FAIL) {
        return {
          success: false,
          paymentId,
          orderId,
          status: "failed",
          method,
          message: "Simulated Decline: UPI mandate rejected by payer PSP app.",
          transactionRef: `tx_upi_fail_${paymentId}`,
        };
      }
    }

    // 4. Handle Net Banking
    if (method === "netbanking" && params.netBankingDetails?.bankCode === "FAIL_BANK") {
      return {
        success: false,
        paymentId,
        orderId,
        status: "failed",
        method,
        message: "Simulated Decline: Net banking session timed out at gateway.",
        transactionRef: `tx_nb_fail_${paymentId}`,
      };
    }

    // 5. Handle explicit simulated outcome parameter
    if (params.simulatedOutcome === "failure") {
      return {
        success: false,
        paymentId,
        orderId,
        status: "failed",
        method,
        message: "Simulated Decline: Payment request was cancelled or failed.",
        transactionRef: `tx_fail_${paymentId}`,
      };
    }

    if (params.simulatedOutcome === "insufficient_funds") {
      return {
        success: false,
        paymentId,
        orderId,
        status: "failed",
        method,
        message: "Simulated Decline: Insufficient funds in bank account.",
        transactionRef: `tx_insufficient_${paymentId}`,
      };
    }

    if (params.simulatedOutcome === "pending") {
      return {
        success: false,
        paymentId,
        orderId,
        status: "pending",
        method,
        message: "Simulated Pending: Transaction awaiting final settlement.",
        transactionRef: `tx_pending_${paymentId}`,
      };
    }

    // Success
    return {
      success: true,
      paymentId,
      orderId,
      status: "success",
      method,
      message: "Demo payment authorized successfully. No real charge occurred.",
      transactionRef: `demo_tx_${crypto.randomBytes(5).toString("hex")}`,
    };
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    const refundId = `demo_rfnd_${crypto.randomBytes(6).toString("hex")}`;
    return {
      success: true,
      refundId,
      paymentId: params.paymentId,
      amount: params.amount,
      status: "processed",
      message: `Simulated Demo Refund of ₹${params.amount.toLocaleString("en-IN")} processed instantly. (Demo policy: zero fees deducted).`,
    };
  }
}
