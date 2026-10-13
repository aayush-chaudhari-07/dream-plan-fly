/**
 * Frankfurter Currency Service
 * Free, key-less currency conversion based on European Central Bank (ECB) reference rates.
 * Cached daily (24-hour TTL) with fallback to INR if currency is unsupported or offline.
 */

export type ExchangeRates = {
  base: string; // "INR"
  date: string;
  rates: Record<string, number>;
  attribution: string;
  attributionUrl: string;
  lastUpdated: number;
};

export type ConversionResult = {
  originalAmount: number; // in INR
  convertedAmount: number;
  currency: string;
  rate: number;
  symbol: string;
  formatted: string;
  isFallback: boolean;
};

// 24-hour daily cache
const CURRENCY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let cachedRates: { data: ExchangeRates; timestamp: number } | null = null;

export function clearCurrencyCache(): void {
  cachedRates = null;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF ",
  SGD: "S$",
  NZD: "NZ$",
  HKD: "HK$",
  SEK: "kr ",
  NOK: "kr ",
  DKK: "kr ",
  PLN: "zł ",
  THB: "฿",
};

/**
 * Fallback rates when Frankfurter API is unreachable
 */
function getFallbackRates(): ExchangeRates {
  return {
    base: "INR",
    date: new Date().toISOString().slice(0, 10),
    rates: {
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      JPY: 1.78,
      AUD: 0.018,
      CAD: 0.016,
      SGD: 0.016,
      CHF: 0.0105,
      THB: 0.42,
    },
    attribution: "European Central Bank reference rates via Frankfurter (Offline Cache)",
    attributionUrl: "https://frankfurter.dev/",
    lastUpdated: Date.now(),
  };
}

/**
 * Fetch live ECB exchange rates with INR as the base currency
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  if (cachedRates && Date.now() - cachedRates.timestamp < CURRENCY_CACHE_TTL_MS) {
    return cachedRates.data;
  }

  const endpoint = "https://api.frankfurter.dev/v1/latest?from=INR";

  try {
    const res = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`Frankfurter API returned status ${res.status}. Using fallback rates.`);
      return getFallbackRates();
    }

    const json = (await res.json()) as {
      base?: string;
      date?: string;
      rates?: Record<string, number>;
    };

    if (!json.rates || typeof json.rates !== "object") {
      console.warn("Frankfurter response missing rates object. Using fallback rates.");
      return getFallbackRates();
    }

    const result: ExchangeRates = {
      base: "INR",
      date: json.date || new Date().toISOString().slice(0, 10),
      rates: json.rates,
      attribution: "European Central Bank reference rates via Frankfurter.dev",
      attributionUrl: "https://frankfurter.dev/",
      lastUpdated: Date.now(),
    };

    cachedRates = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.warn("Failed to fetch rates from Frankfurter API:", err);
    return getFallbackRates();
  }
}

/**
 * Convert an amount from INR to a target currency.
 * If target currency is unsupported, falls back to INR only.
 */
export async function convertCurrency(
  amountInr: number,
  targetCurrency = "INR",
): Promise<ConversionResult> {
  const norm = targetCurrency.toUpperCase().trim();

  // If INR or empty, return 1:1 INR
  if (!norm || norm === "INR") {
    return {
      originalAmount: amountInr,
      convertedAmount: Math.round(amountInr),
      currency: "INR",
      rate: 1.0,
      symbol: "₹",
      formatted: `₹${Math.round(amountInr).toLocaleString("en-IN")}`,
      isFallback: false,
    };
  }

  const ratesData = await fetchExchangeRates();
  const rate = ratesData.rates[norm];

  // If currency is unsupported by Frankfurter / ECB, fallback to INR only
  if (!rate || typeof rate !== "number") {
    return {
      originalAmount: amountInr,
      convertedAmount: Math.round(amountInr),
      currency: "INR",
      rate: 1.0,
      symbol: "₹",
      formatted: `₹${Math.round(amountInr).toLocaleString("en-IN")}`,
      isFallback: true,
    };
  }

  const converted = amountInr * rate;
  const symbol = CURRENCY_SYMBOLS[norm] || `${norm} `;

  // Format nicely (e.g. 2 decimal places for USD/EUR, 0 for JPY/INR)
  const isZeroDec = norm === "JPY" || norm === "KRW";
  const formattedVal = isZeroDec ? Math.round(converted).toLocaleString() : converted.toFixed(2);

  return {
    originalAmount: amountInr,
    convertedAmount: converted,
    currency: norm,
    rate,
    symbol,
    formatted: `${symbol}${formattedVal}`,
    isFallback: false,
  };
}
