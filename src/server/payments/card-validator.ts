// Known safe demo test cards
export const DEMO_TEST_CARDS = {
  SUCCESS: "4000000000000002",
  DECLINED: "4000000000000005",
  INSUFFICIENT_FUNDS: "4000000000000007",
  PENDING: "4000000000000009",
} as const;

export const DEMO_TEST_UPIS = {
  SUCCESS: "success@upi",
  SMARTTRIP: "demo@smarttrip",
  FAIL: "fail@upi",
} as const;

/**
 * Check if a card number is one of our explicitly permitted demo cards.
 */
export function isAllowedDemoCard(rawCardNumber: string): boolean {
  const cleaned = rawCardNumber.replace(/[\s-]/g, "");
  return Object.values(DEMO_TEST_CARDS).includes(
    cleaned as (typeof DEMO_TEST_CARDS)[keyof typeof DEMO_TEST_CARDS],
  );
}

/**
 * Standard Luhn check to detect genuine credit cards.
 */
export function passesLuhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/**
 * Detect if input appears to be a real, live payment card.
 * Throws a security error refusing real card processing in Demo Mode.
 */
export function validateDemoCardSafety(rawCardNumber: string): void {
  const cleaned = rawCardNumber.replace(/[\s-]/g, "");

  // If it's one of our pre-approved demo test cards, allow it
  if (isAllowedDemoCard(cleaned)) {
    return;
  }

  // If card has 13-19 digits and either passes Luhn or matches major BIN prefixes (Visa, MC, Amex, RuPay)
  if (/^\d{13,19}$/.test(cleaned) && (passesLuhnCheck(cleaned) || /^(4|5|3|6|8)/.test(cleaned))) {
    throw new Error(
      "Demo Mode: Real credit or debit card numbers are not accepted for your security. Please use one of the provided Test Card numbers.",
    );
  }
}
