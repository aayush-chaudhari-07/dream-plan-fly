export type PaymentMethod = "card" | "upi" | "netbanking";

export type PaymentStatus = "pending" | "success" | "failed";

export type CreateOrderParams = {
  amount: number; // in INR
  currency?: string | undefined; // defaults to INR
  receipt: string;
  notes?: Record<string, string> | undefined;
};

export type OrderResult = {
  orderId: string;
  amount: number;
  currency: string;
  provider: "demo" | "razorpay";
  keyId?: string | undefined; // Client-side key for Razorpay, or undefined for DemoPay
};

export type CardInput = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
};

export type UpiInput = {
  vpa: string; // e.g. success@upi or mobile@okhdfcbank
};

export type NetBankingInput = {
  bankCode: string; // HDFC, ICICI, SBI, AXIS, etc.
};

export type VerifyPaymentParams = {
  orderId: string;
  paymentId: string;
  amount: number;
  signature: string;
  method?: PaymentMethod | undefined;
  cardDetails?: CardInput | undefined;
  upiDetails?: UpiInput | undefined;
  netBankingDetails?: NetBankingInput | undefined;
  simulatedOutcome?: ("success" | "failure" | "insufficient_funds" | "pending") | undefined;
};

export type VerifyResult = {
  success: boolean;
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  method: PaymentMethod;
  message: string;
  transactionRef: string;
};

export type RefundParams = {
  paymentId: string;
  amount: number;
  reason?: string | undefined;
};

export type RefundResult = {
  success: boolean;
  refundId: string;
  paymentId: string;
  amount: number;
  status: "processed" | "failed";
  message: string;
};

export interface PaymentProvider {
  name: string;
  isTestMode: boolean;
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyResult>;
  refund(params: RefundParams): Promise<RefundResult>;
}
