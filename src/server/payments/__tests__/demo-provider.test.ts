import { describe, it, expect } from "vitest";
import {
  DemoPayProvider,
  DEMO_TEST_CARDS,
  DEMO_TEST_UPIS,
  generateDemoSignature,
  verifyDemoSignature,
  validateDemoCardSafety,
  isAllowedDemoCard,
  passesLuhnCheck,
} from "../demo-provider";

describe("DemoPayProvider & HMAC Signature Verification", () => {
  const provider = new DemoPayProvider();

  it("generates and verifies valid HMAC-SHA256 signatures", () => {
    const orderId = "demo_ord_abc123";
    const paymentId = "demo_pay_xyz789";
    const amount = 4899;

    const signature = generateDemoSignature(orderId, paymentId, amount);
    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBe(64); // 256-bit hex

    const isValid = verifyDemoSignature(orderId, paymentId, amount, signature);
    expect(isValid).toBe(true);
  });

  it("rejects tampered payment amounts or mismatched signatures", () => {
    const orderId = "demo_ord_abc123";
    const paymentId = "demo_pay_xyz789";
    const amount = 4899;

    const signature = generateDemoSignature(orderId, paymentId, amount);

    // Tampered amount (4899 -> 9999)
    const isTamperedAmountValid = verifyDemoSignature(orderId, paymentId, 9999, signature);
    expect(isTamperedAmountValid).toBe(false);

    // Tampered orderId
    const isTamperedOrderValid = verifyDemoSignature("demo_ord_FAKE", paymentId, amount, signature);
    expect(isTamperedOrderValid).toBe(false);
  });

  it("creates demo orders with expected metadata", async () => {
    const order = await provider.createOrder({
      amount: 7500,
      receipt: "rcpt_test_1",
    });

    expect(order.orderId).toMatch(/^demo_ord_/);
    expect(order.amount).toBe(7500);
    expect(order.currency).toBe("INR");
    expect(order.provider).toBe("demo");
  });

  it("successfully authorizes transactions with the designated Success test card", async () => {
    const orderId = "demo_ord_success_test";
    const paymentId = "demo_pay_success_1";
    const amount = 3200;
    const signature = generateDemoSignature(orderId, paymentId, amount);

    const res = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "card",
      cardDetails: {
        cardNumber: DEMO_TEST_CARDS.SUCCESS,
        expiryMonth: "12",
        expiryYear: "2028",
        cvv: "123",
        cardholderName: "Test Traveler",
      },
    });

    expect(res.success).toBe(true);
    expect(res.status).toBe("success");
    expect(res.transactionRef).toMatch(/^demo_tx_/);
  });

  it("simulates card declines for the designated Declined test card", async () => {
    const orderId = "demo_ord_declined_test";
    const paymentId = "demo_pay_declined_1";
    const amount = 3200;
    const signature = generateDemoSignature(orderId, paymentId, amount);

    const res = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "card",
      cardDetails: {
        cardNumber: DEMO_TEST_CARDS.DECLINED,
        expiryMonth: "12",
        expiryYear: "2028",
        cvv: "123",
        cardholderName: "Test Traveler",
      },
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("failed");
    expect(res.message).toContain("declined by issuing bank");
  });

  it("simulates insufficient funds for the Insufficient Funds test card", async () => {
    const orderId = "demo_ord_insufficient_test";
    const paymentId = "demo_pay_insufficient_1";
    const amount = 3200;
    const signature = generateDemoSignature(orderId, paymentId, amount);

    const res = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "card",
      cardDetails: {
        cardNumber: DEMO_TEST_CARDS.INSUFFICIENT_FUNDS,
        expiryMonth: "12",
        expiryYear: "2028",
        cvv: "123",
        cardholderName: "Test Traveler",
      },
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("failed");
    expect(res.message).toContain("Insufficient account funds");
  });

  it("simulates pending status for the Pending test card", async () => {
    const orderId = "demo_ord_pending_test";
    const paymentId = "demo_pay_pending_1";
    const amount = 3200;
    const signature = generateDemoSignature(orderId, paymentId, amount);

    const res = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "card",
      cardDetails: {
        cardNumber: DEMO_TEST_CARDS.PENDING,
        expiryMonth: "12",
        expiryYear: "2028",
        cvv: "123",
        cardholderName: "Test Traveler",
      },
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe("pending");
  });

  it("handles UPI simulation for success and failure VPAs", async () => {
    const orderId = "demo_ord_upi_test";
    const paymentId = "demo_pay_upi_1";
    const amount = 1500;
    const signature = generateDemoSignature(orderId, paymentId, amount);

    // Success VPA
    const successRes = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "upi",
      upiDetails: { vpa: DEMO_TEST_UPIS.SUCCESS },
    });
    expect(successRes.success).toBe(true);

    // Fail VPA
    const failRes = await provider.verifyPayment({
      orderId,
      paymentId,
      amount,
      signature,
      method: "upi",
      upiDetails: { vpa: DEMO_TEST_UPIS.FAIL },
    });
    expect(failRes.success).toBe(false);
    expect(failRes.status).toBe("failed");
  });

  it("processes simulated demo refunds with 100% credit and zero fees", async () => {
    const refund = await provider.refund({
      paymentId: "demo_pay_rfnd_123",
      amount: 4899,
      reason: "User requested demo cancellation",
    });

    expect(refund.success).toBe(true);
    expect(refund.refundId).toMatch(/^demo_rfnd_/);
    expect(refund.amount).toBe(4899);
    expect(refund.status).toBe("processed");
    expect(refund.message).toContain("zero fees deducted");
  });
});

describe("Real Card Security Rejection in Demo Mode", () => {
  it("allows designated test card numbers", () => {
    expect(isAllowedDemoCard(DEMO_TEST_CARDS.SUCCESS)).toBe(true);
    expect(isAllowedDemoCard(DEMO_TEST_CARDS.DECLINED)).toBe(true);
    expect(() => validateDemoCardSafety(DEMO_TEST_CARDS.SUCCESS)).not.toThrow();
  });

  it("detects and strictly refuses real Visa / Mastercard numbers", () => {
    // Valid 16-digit card pattern
    const realLookingCard = "4111111111111111"; // Standard live Visa test number
    expect(isAllowedDemoCard(realLookingCard)).toBe(false);
    expect(passesLuhnCheck(realLookingCard)).toBe(true);

    expect(() => validateDemoCardSafety(realLookingCard)).toThrow(
      /Real credit or debit card numbers are not accepted/i,
    );
  });
});
