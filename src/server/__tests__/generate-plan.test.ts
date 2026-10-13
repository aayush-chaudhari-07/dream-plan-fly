import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeGeneratePlan, generatedPlanSchema, normalizePlan } from "../generate-plan";
import { checkRateLimit, resetRateLimits } from "../rate-limiter";

// Mock @google/genai module
const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  class MockGoogleGenAI {
    models = {
      generateContent: mockGenerateContent,
    };
    constructor(_opts?: unknown) {}
  }
  return {
    GoogleGenAI: MockGoogleGenAI,
  };
});

const sampleValidPlan = {
  title: "Himachal Pradesh · Adventure & Peaks",
  budget: 35000,
  summary: "A 5-day scenic mountain itinerary with hikes and local culture.",
  days: [
    {
      day: "Day 1",
      title: "Arrival in Shimla",
      items: ["Check in to heritage hotel", "Evening walk on Mall Road"],
    },
    {
      day: "Day 2",
      title: "Kufri & Scenic Valley",
      items: ["Trek in Mahasu Peak", "Local street food tasting"],
    },
  ],
  stays: ["Shimla Pine Retreat", "Manali Valley Hotel"],
  transport: "Volvo bus from Delhi + local cab",
  food: ["Himachali Siddu", "Chha Gosht", "Madra"],
  weather: "Mild sunshine 16-22°C, cooler nights around 10°C",
  packing: ["Windcheater", "Warm layers", "Trekking boots"],
  tips: ["Book Volvo tickets in advance", "Keep cash handy for rural toll booths"],
  travelers: 3,
  nights: 4,
  breakdown: [
    { label: "Accommodation", amount: 14000 },
    { label: "Transport", amount: 9000 },
    { label: "Food & Cafes", amount: 7000 },
    { label: "Activities & Sightseeing", amount: 5000 },
  ],
  carbonKg: 75,
};

describe("generatePlan - LLM Integration & Fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
  });

  it("successfully generates structured plan via Gemini LLM", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(sampleValidPlan),
    });

    const result = await executeGeneratePlan(
      {
        prompt: "5-day trip to Himachal Pradesh for 3 people under ₹35,000",
        budget: 35000,
        travelers: 3,
        days: 5,
      },
      {
        apiKey: "fake-test-api-key",
        identifier: "test-user-1",
      },
    );

    expect(result.source).toBe("gemini");
    expect(result.plan.title).toBe(sampleValidPlan.title);
    expect(result.plan.budget).toBe(35000);
    expect(result.plan.days.length).toBe(2);
    expect(result.plan.breakdown.reduce((sum, b) => sum + b.amount, 0)).toBe(35000);
  });

  it("retries once when initial Gemini response schema validation fails, then succeeds", async () => {
    // Attempt 1: Malformed JSON or invalid schema (missing required fields)
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        title: "Incomplete Trip",
        // missing budget, days, breakdown, etc.
      }),
    });

    // Attempt 2 (Retry): Valid plan matching schema
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(sampleValidPlan),
    });

    const result = await executeGeneratePlan(
      {
        prompt: "5-day trip to Himachal Pradesh",
      },
      {
        apiKey: "fake-test-api-key",
        identifier: "test-user-retry",
      },
    );

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(result.source).toBe("gemini");
    expect(result.plan.title).toBe(sampleValidPlan.title);
  });

  it("falls back to buildPlan() when Gemini validation fails across all retries", async () => {
    // Both attempts return invalid output
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({ invalidField: "wrong" }),
    });
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({ stillInvalid: true }),
    });

    const result = await executeGeneratePlan(
      {
        prompt: "5-day trip to Goa under ₹30,000 for 2 people",
        budget: 30000,
      },
      {
        apiKey: "fake-test-api-key",
        identifier: "test-user-fallback-retry",
      },
    );

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(result.source).toBe("fallback");
    expect(result.plan.title).toContain("Goa");
    expect(result.plan.budget).toBe(30000);
  });

  it("falls back immediately to buildPlan() when GEMINI_API_KEY is missing", async () => {
    const result = await executeGeneratePlan(
      {
        prompt: "Trip to Kashmir for 2 under ₹40,000",
      },
      {
        apiKey: "",
        identifier: "test-no-key",
      },
    );

    expect(mockGenerateContent).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.plan.title).toContain("Kashmir");
    expect(result.note).toContain("GEMINI_API_KEY not configured");
  });

  it("falls back to buildPlan() when Gemini throws network/API errors on all attempts", async () => {
    mockGenerateContent.mockRejectedValue(new Error("503 Service Unavailable"));

    const result = await executeGeneratePlan(
      {
        prompt: "Trip to Himachal Pradesh for 2",
      },
      {
        apiKey: "fake-test-key",
        identifier: "test-network-error",
      },
    );

    expect(result.source).toBe("fallback");
    expect(result.plan).toBeDefined();
    expect(result.plan.days.length).toBeGreaterThan(0);
  });
});

describe("generatedPlanSchema validation", () => {
  it("validates conforming plan object successfully", () => {
    const parsed = generatedPlanSchema.safeParse(sampleValidPlan);
    expect(parsed.success).toBe(true);
  });

  it("fails validation if required fields are missing", () => {
    const { title: _omit, ...missingTitle } = sampleValidPlan;
    const parsed = generatedPlanSchema.safeParse(missingTitle);
    expect(parsed.success).toBe(false);
  });

  it("fails validation if days array is empty", () => {
    const invalid = { ...sampleValidPlan, days: [] };
    const parsed = generatedPlanSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("fails validation if breakdown is empty", () => {
    const invalid = { ...sampleValidPlan, breakdown: [] };
    const parsed = generatedPlanSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});

describe("normalizePlan - Budget Breakdown Sum Rule", () => {
  it("preserves breakdown when it already matches budget", () => {
    const plan = JSON.parse(JSON.stringify(sampleValidPlan));
    const normalized = normalizePlan(plan);
    const sum = normalized.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBe(plan.budget);
  });

  it("adjusts breakdown discrepancy so amounts sum exactly to total budget", () => {
    const plan = JSON.parse(JSON.stringify(sampleValidPlan));
    plan.budget = 50000;
    // Breakdown currently sums to 35000, diff is +15000
    const normalized = normalizePlan(plan);
    const sum = normalized.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBe(50000);
  });

  it("handles negative differences safely", () => {
    const plan = JSON.parse(JSON.stringify(sampleValidPlan));
    plan.budget = 20000;
    // Breakdown currently sums to 35000, diff is -15000
    const normalized = normalizePlan(plan);
    const sum = normalized.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBe(20000);
    normalized.breakdown.forEach((item) => {
      expect(item.amount).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("rate-limiter", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within rate limit and blocks when limit is exceeded", () => {
    const id = "test-rate-user";
    const limit = 3;
    const windowMs = 5000;

    expect(checkRateLimit(id, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(id, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(id, limit, windowMs).allowed).toBe(true);

    // 4th request exceeds limit
    const exceeded = checkRateLimit(id, limit, windowMs);
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);
  });

  it("resets limits when resetRateLimits() is called", () => {
    const id = "test-rate-user-2";
    checkRateLimit(id, 1, 5000);
    expect(checkRateLimit(id, 1, 5000).allowed).toBe(false);

    resetRateLimits();
    expect(checkRateLimit(id, 1, 5000).allowed).toBe(true);
  });
});

describe("Free-Tier Quota Protection & Caching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
  });

  it("serves identical queries from server cache without invoking Gemini API again", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(sampleValidPlan),
    });

    const input = {
      prompt: "4 days in Goa for 2 people under 25000",
      budget: 25000,
      travelers: 2,
      days: 4,
    };

    // First call: hits Gemini
    const firstResult = await executeGeneratePlan(input, {
      apiKey: "test-api-key",
      identifier: "user:cached-user-1",
    });
    expect(firstResult.source).toBe("gemini");
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);

    // Second call with identical input: served from server cache
    const secondResult = await executeGeneratePlan(input, {
      apiKey: "test-api-key",
      identifier: "user:cached-user-2",
    });
    expect(secondResult.source).toBe("gemini");
    expect(secondResult.note).toContain("Served from server plan cache");
    // Gemini API was NOT called a second time
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it("gracefully falls back to offline buildPlan() when Gemini returns 429 Too Many Requests", async () => {
    mockGenerateContent.mockRejectedValueOnce(
      new Error("GoogleGenerativeAIError: [429 Too Many Requests] RESOURCE_EXHAUSTED"),
    );

    const result = await executeGeneratePlan(
      {
        prompt: "4-day trip to Goa under 20000",
        budget: 20000,
      },
      {
        apiKey: "test-api-key",
        identifier: "user:rate-limit-test",
      },
    );

    expect(result.source).toBe("fallback");
    expect(result.note).toContain("HTTP 429");
    expect(result.plan).toBeDefined();
    expect(result.plan.title).toContain("Goa");
  });

  it("enforces guest daily quota limit and falls back to offline engine", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(sampleValidPlan),
    });

    const guestId = "ip:192.168.1.100";

    // Exhaust guest limit (5 calls)
    for (let i = 1; i <= 5; i++) {
      const res = await executeGeneratePlan(
        { prompt: `Unique prompt ${i} to bypass cache` },
        { apiKey: "test-api-key", identifier: guestId },
      );
      expect(res.source).toBe("gemini");
    }

    // 6th call exceeds guest quota: fallback without error
    const exceeded = await executeGeneratePlan(
      { prompt: "Unique prompt 6 to bypass cache" },
      { apiKey: "test-api-key", identifier: guestId },
    );
    expect(exceeded.source).toBe("fallback");
    expect(exceeded.note).toContain("Daily guest plan allowance reached");
  });
});
