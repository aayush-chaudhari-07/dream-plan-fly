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

/**
 * Optional Razorpay Test Provider.
 * Activates ONLY if both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.
 * Razorpay Test Mode is free and operates with simulated test cards/UPIS.
 */
export class RazorpayTestProvider implements PaymentProvider {
  name = "Razorpay Test Gateway";
  isTestMode = true;

  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env["RAZORPAY_KEY_ID"] || "";
    this.keySecret = process.env["RAZORPAY_KEY_SECRET"] || "";
  }

  static isConfigured(): boolean {
    const key = process.env["RAZORPAY_KEY_ID"];
    const secret = process.env["RAZORPAY_KEY_SECRET"];
    return Boolean(key && secret && key.startsWith("rzp_test_"));
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    if (!RazorpayTestProvider.isConfigured()) {
      throw new Error(
        "Razorpay Test Provider is disabled: Missing rzp_test_ API credentials in environment.",
      );
    }

    // In a live environment with network access to api.razorpay.com, you would POST /v1/orders
    // Here we generate the valid test order structure
    const orderId = `order_test_${crypto.randomBytes(7).toString("hex")}`;

    return {
      orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      provider: "razorpay",
      keyId: this.keyId,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyResult> {
    if (!RazorpayTestProvider.isConfigured()) {
      throw new Error("Razorpay Test Provider is disabled.");
    }

    const { orderId, paymentId, signature } = params;
    const body = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", this.keySecret).update(body).digest("hex");

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );

    if (!isMatch) {
      return {
        success: false,
        paymentId,
        orderId,
        status: "failed",
        method: params.method || "card",
        message: "Razorpay signature verification mismatch.",
        transactionRef: paymentId,
      };
    }

    return {
      success: true,
      paymentId,
      orderId,
      status: "success",
      method: params.method || "card",
      message: "Razorpay test payment verified.",
      transactionRef: paymentId,
    };
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    return {
      success: true,
      refundId: `rfnd_test_${crypto.randomBytes(6).toString("hex")}`,
      paymentId: params.paymentId,
      amount: params.amount,
      status: "processed",
      message: "Razorpay test refund processed.",
    };
  }
}
