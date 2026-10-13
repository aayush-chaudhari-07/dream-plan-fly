import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildPlan, type GeneratedPlan } from "@/lib/trip-plan";
import { getServerUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/server/rate-limiter";

// ==============================================================================
// VALIDATION SCHEMAS
// ==============================================================================

export const planDayItemSchema = z.object({
  time: z.string().optional(),
  activity: z.string().optional(),
  cost: z.string().optional(),
});

export const generatedPlanSchema = z.object({
  title: z.string().min(1),
  budget: z.number().positive(),
  summary: z.string().min(1),
  days: z
    .array(
      z.object({
        day: z.string(),
        title: z.string(),
        items: z.array(z.string()).min(1),
      }),
    )
    .min(1),
  stays: z.array(z.string()).min(1),
  transport: z.string().min(1),
  food: z.array(z.string()).min(1),
  weather: z.string().min(1),
  packing: z.array(z.string()).min(1),
  tips: z.array(z.string()).min(1),
  travelers: z.number().int().positive(),
  nights: z.number().int().nonnegative(),
  breakdown: z
    .array(
      z.object({
        label: z.string(),
        amount: z.number().nonnegative(),
      }),
    )
    .min(1),
  carbonKg: z.number().nonnegative(),
});

export const generatePlanInputSchema = z.object({
  prompt: z.string().min(1).max(1000),
  destination: z.string().max(100).optional(),
  interests: z.array(z.string().max(50)).max(10).optional(),
  budget: z.number().int().positive().max(10_000_000).optional(),
  travelers: z.number().int().positive().max(50).optional(),
  days: z.number().int().positive().max(30).optional(),
  instruction: z.string().max(500).optional(),
  currentPlan: z.any().optional(),
});

export type GeneratePlanInput = z.infer<typeof generatePlanInputSchema>;

// Memory cache for public shared plans (fallback if DB unconfigured or during tests)
const sharedPlansMemoryStore = new Map<string, GeneratedPlan>();

// ==============================================================================
// HELPER: BUILD PROMPT
// ==============================================================================

function extractTripContext(prompt: string) {
  const p = prompt.toLowerCase();
  const destMatch = p.match(
    /(?:to|in|for|visit|exploring)\s+([a-zA-Z\s]+?)(?:\s+(?:for|under|with|in|\d|$))/i,
  );
  let destination = destMatch ? destMatch[1]?.trim() : "";
  if (!destination || destination.length < 3) {
    if (/himachal/i.test(p)) destination = "Himachal Pradesh";
    else if (/goa/i.test(p)) destination = "Goa";
    else if (/kashmir/i.test(p)) destination = "Kashmir";
    else if (/kerala/i.test(p)) destination = "Kerala";
    else if (/ladakh/i.test(p)) destination = "Ladakh";
    else if (/japan/i.test(p)) destination = "Japan";
    else if (/bali/i.test(p)) destination = "Bali";
    else if (/dubai/i.test(p)) destination = "Dubai";
    else destination = "Requested destination";
  }

  const interests: string[] = [];
  if (/adventure|trek|hike|rafting|scuba|camp/i.test(p))
    interests.push("Adventure & Outdoor activities");
  if (/beach|sea|coast|relax|sunset/i.test(p)) interests.push("Beaches & Coastal relaxation");
  if (/food|cafe|cuisine|street food|eat|culinary/i.test(p))
    interests.push("Local Cuisine & Street Food");
  if (/temple|heritage|culture|history|monument|fort/i.test(p))
    interests.push("Culture, Heritage & Architecture");
  if (/nature|wildlife|safari|mountain|snow|scenic/i.test(p))
    interests.push("Nature & Mountain Landscapes");
  if (/shopping|market|bazaar/i.test(p)) interests.push("Local Bazaars & Shopping");
  if (interests.length === 0) interests.push("Iconic Highlights & Local Experiences");

  return { destination, interests };
}

function buildGeminiPrompt(
  prompt: string,
  opts: {
    destination?: string | undefined;
    interests?: string[] | undefined;
    budget?: number | undefined;
    travelers?: number | undefined;
    days?: number | undefined;
    instruction?: string | undefined;
    currentPlan?: GeneratedPlan | undefined;
  },
): string {
  const extracted = extractTripContext(prompt);
  const destination = opts.destination || extracted.destination;
  const interests =
    opts.interests && opts.interests.length > 0 ? opts.interests : extracted.interests;
  const budget = opts.budget
    ? `₹${opts.budget.toLocaleString("en-IN")}`
    : "Extract from prompt or default to ₹35,000 INR";
  const days = opts.days ?? "Extract from prompt or default to 5";
  const travelers = opts.travelers ?? "Extract from prompt or default to 2";

  return `You are SmartTrip's elite AI travel planner. Create an authentic, highly detailed, realistic travel itinerary.

TRAVELER INQUIRY:
"${prompt}"

TRIP SPECIFICATIONS:
- Destination: ${destination}
- Duration: ${days} days
- Travelers: ${travelers} people
- Budget: ${budget} (in Indian Rupees - INR)
- Interests & Preferences: ${interests.join(", ")}
${opts.instruction ? `\nUSER REFINEMENT INSTRUCTION: "${opts.instruction}"` : ""}
${opts.currentPlan ? `\nBASE ITINERARY TO REFINE:\n${JSON.stringify(opts.currentPlan)}` : ""}

STRICT REQUIREMENTS & RULES:
1. Real Attractions & Authentic Sights: Recommend real, verified attractions, viewpoints, and scenic stops with logical daily pacing.
2. Local Food: Recommend authentic local food specialties, regional cuisines, and genuine eateries or dish names.
3. Realistic INR Prices: All estimated costs for stays, transport, food, and activities must reflect realistic current Indian Rupee (INR) rates.
4. Budget Breakdown Sum Rule: The 'breakdown' array MUST include categories (e.g. Transport, Stays, Food, Activities, Sightseeing & Entry, Buffer) whose amounts SUM EXACTLY TO THE TOTAL BUDGET (${opts.budget ?? 35000}). Every category amount must be non-negative.
5. Season-Appropriate Weather & Packing Advice: Provide realistic weather conditions with Celsius temperature ranges for the destination's current travel season, plus practical, destination-appropriate packing advice.
6. Carbon Footprint: Estimate the round-trip carbon footprint (carbonKg) in kg CO2e per traveler based on travel modes.
7. Return strictly valid structured JSON matching the defined schema.`;
}

// ==============================================================================
// HELPER: NORMALIZE BUDGET BREAKDOWN
// ==============================================================================

export function normalizePlan(plan: GeneratedPlan): GeneratedPlan {
  if (!plan.breakdown || plan.breakdown.length === 0) {
    plan.breakdown = [
      { label: "Stays & Hotels", amount: Math.round(plan.budget * 0.4) },
      { label: "Transport & Travel", amount: Math.round(plan.budget * 0.25) },
      { label: "Food & Dining", amount: Math.round(plan.budget * 0.2) },
      {
        label: "Activities & Buffer",
        amount: Math.max(
          0,
          plan.budget -
            (Math.round(plan.budget * 0.4) +
              Math.round(plan.budget * 0.25) +
              Math.round(plan.budget * 0.2)),
        ),
      },
    ];
    return plan;
  }
  const sumBreakdown = plan.breakdown.reduce((sum, item) => sum + item.amount, 0);
  if (sumBreakdown !== plan.budget) {
    const diff = plan.budget - sumBreakdown;
    const lastIndex = plan.breakdown.length - 1;
    const lastItem = plan.breakdown[lastIndex];
    if (lastItem && lastItem.amount + diff >= 0) {
      lastItem.amount += diff;
    } else {
      let runningSum = 0;
      for (let i = 0; i < plan.breakdown.length; i++) {
        const item = plan.breakdown[i]!;
        if (i === lastIndex) {
          item.amount = Math.max(0, plan.budget - runningSum);
        } else {
          item.amount = Math.round((item.amount / (sumBreakdown || 1)) * plan.budget);
          runningSum += item.amount;
        }
      }
    }
  }
  return plan;
}

// ==============================================================================
// CORE GEMINI CALL (with test mocking support)
// ==============================================================================

export async function callGeminiApi(promptText: string, apiKey: string): Promise<unknown> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          budget: { type: "number" },
          summary: { type: "string" },
          days: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "string" },
                title: { type: "string" },
                items: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["day", "title", "items"],
            },
          },
          stays: {
            type: "array",
            items: { type: "string" },
          },
          transport: { type: "string" },
          food: {
            type: "array",
            items: { type: "string" },
          },
          weather: { type: "string" },
          packing: {
            type: "array",
            items: { type: "string" },
          },
          tips: {
            type: "array",
            items: { type: "string" },
          },
          travelers: { type: "number" },
          nights: { type: "number" },
          breakdown: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                amount: { type: "number" },
              },
              required: ["label", "amount"],
            },
          },
          carbonKg: { type: "number" },
        },
        required: [
          "title",
          "budget",
          "summary",
          "days",
          "stays",
          "transport",
          "food",
          "weather",
          "packing",
          "tips",
          "travelers",
          "nights",
          "breakdown",
          "carbonKg",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return JSON.parse(text);
}

// ==============================================================================
// CORE LOGIC: executeGeneratePlan
// ==============================================================================

export async function executeGeneratePlan(
  input: GeneratePlanInput,
  options?: {
    identifier?: string;
    apiKey?: string;
  },
) {
  // 1. Rate limiting
  const identifier = options?.identifier ?? "guest";
  const rate = checkRateLimit(identifier, 25, 10 * 60 * 1000);
  if (!rate.allowed) {
    throw new Error("Rate limit exceeded. Please wait a few moments before generating more plans.");
  }

  const apiKey =
    options?.apiKey !== undefined
      ? options.apiKey
      : (typeof process !== "undefined" ? process.env?.["GEMINI_API_KEY"] : undefined) || "";

  // If no Gemini API key configured, use rule-based fallback immediately
  if (!apiKey) {
    const fallbackPlan = buildPlan(input.prompt, {
      budget: input.budget,
      travelers: input.travelers,
      days: input.days,
    });
    return {
      plan: fallbackPlan,
      source: "fallback" as const,
      note: "Built using offline fallback engine (GEMINI_API_KEY not configured).",
    };
  }

  const promptText = buildGeminiPrompt(input.prompt, {
    destination: input.destination,
    interests: input.interests,
    budget: input.budget,
    travelers: input.travelers,
    days: input.days,
    instruction: input.instruction,
    currentPlan: input.currentPlan,
  });

  // 2. Call Gemini with 1 retry on validation/API failure
  let validatedPlan: GeneratedPlan | null = null;
  let attempts = 0;
  const maxAttempts = 2; // initial + 1 retry

  while (attempts < maxAttempts && !validatedPlan) {
    attempts++;
    try {
      const rawJson = await callGeminiApi(promptText, apiKey);
      const parsed = generatedPlanSchema.parse(rawJson);
      validatedPlan = normalizePlan(parsed);
    } catch (err) {
      console.warn(`Gemini API attempt ${attempts} failed:`, err);
      if (attempts >= maxAttempts) break;
    }
  }

  // 3. Fallback to buildPlan if all attempts fail
  if (!validatedPlan) {
    console.warn("All Gemini generation attempts failed. Falling back to buildPlan().");
    const fallbackPlan = buildPlan(input.prompt, {
      budget: input.budget,
      travelers: input.travelers,
      days: input.days,
    });
    return {
      plan: fallbackPlan,
      source: "fallback" as const,
      note: "Gemini response validation failed; fallback applied.",
    };
  }

  return {
    plan: validatedPlan,
    source: "gemini" as const,
    model: "gemini-2.5-flash",
  };
}

// ==============================================================================
// SERVER FUNCTION: generatePlan
// ==============================================================================

export const generatePlan = createServerFn({ method: "POST" })
  .validator((data: unknown) => generatePlanInputSchema.parse(data))
  .handler(async ({ data: input }) => {
    let identifier = "guest";
    try {
      const user = await getServerUser();
      if (user?.id) {
        identifier = `user:${user.id}`;
      } else {
        const ip =
          getRequestIP({ xForwardedFor: true }) ||
          getRequestHeader("x-forwarded-for") ||
          "client-ip";
        identifier = `ip:${ip}`;
      }
    } catch {
      identifier = "anon";
    }

    return executeGeneratePlan(input, { identifier });
  });

// ==============================================================================
// PUBLIC SHARED PLAN SERVER FUNCTIONS (/plan/$id)
// ==============================================================================

const savePublicPlanSchema = z.object({
  plan: generatedPlanSchema,
});

export const savePublicPlanFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => savePublicPlanSchema.parse(data))
  .handler(async ({ data: { plan } }) => {
    const planId = `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    // 1. Store in in-memory cache
    sharedPlansMemoryStore.set(planId, plan);

    // 2. Persist to Supabase shared_plans if configured
    try {
      const user = await getServerUser();
      const supabase = getSupabaseServerClient();
      await supabase.from("shared_plans").insert({
        id: planId,
        user_id: user?.id ?? null,
        plan,
        title: plan.title,
        destination: plan.title.replace(/ · smart plan$/, ""),
        budget: plan.budget,
      });
    } catch (e) {
      // Memory store already holds the plan
      console.warn("Could not save shared plan to database:", e);
    }

    return { id: planId };
  });

const getPublicPlanSchema = z.object({
  id: z.string().min(1),
});

export const getPublicPlanFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => getPublicPlanSchema.parse(data))
  .handler(async ({ data: { id: planId } }) => {
    // 1. Check in-memory store
    if (sharedPlansMemoryStore.has(planId)) {
      return sharedPlansMemoryStore.get(planId) ?? null;
    }

    // 2. Check Supabase shared_plans
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("shared_plans")
        .select("plan")
        .eq("id", planId)
        .maybeSingle();

      if (!error && data?.plan) {
        const plan = data.plan as GeneratedPlan;
        sharedPlansMemoryStore.set(planId, plan);
        return plan;
      }
    } catch {
      /* ignore */
    }

    return null;
  });
