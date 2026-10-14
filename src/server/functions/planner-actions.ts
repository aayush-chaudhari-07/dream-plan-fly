import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { GeneratedPlan } from "@/shared/types/trip-plan";
import { getServerUser, getSupabaseServerClient } from "@/server/db/supabase-server";
import {
  executeGeneratePlan,
  generatePlanInputSchema,
  generatedPlanSchema,
} from "@/server/services/gemini-planner";

const sharedPlansMemoryStore = new Map<string, GeneratedPlan>();

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
