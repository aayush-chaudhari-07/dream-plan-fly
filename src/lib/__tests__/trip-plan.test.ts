import { describe, expect, it } from "vitest";
import { buildPlan, carbonFor } from "../trip-plan";

describe("trip-plan - buildPlan", () => {
  it("defaults to standard values when prompt contains no specifics", () => {
    const plan = buildPlan("Take me somewhere nice");
    expect(plan.budget).toBe(35000);
    expect(plan.travelers).toBe(2);
    expect(plan.days.length).toBe(5);
    expect(plan.nights).toBe(4);
  });

  it("parses budget correctly from prompt", () => {
    const plan = buildPlan("Trip to Goa under ₹65,000 for 2");
    expect(plan.budget).toBe(65000);
  });

  it("allows options to override parsed budget", () => {
    const plan = buildPlan("Trip to Goa under ₹65,000", { budget: 45000 });
    expect(plan.budget).toBe(45000);
  });

  it("parses traveler counts from different keyword variations", () => {
    expect(buildPlan("trip for 4 people").travelers).toBe(4);
    expect(buildPlan("trip for 5 persons").travelers).toBe(5);
    expect(buildPlan("trip for 3 travellers").travelers).toBe(3);
    expect(buildPlan("trip for 6 travelers").travelers).toBe(6);
    expect(buildPlan("trip with 4 friends").travelers).toBe(4);
    expect(buildPlan("trip for 2 adults").travelers).toBe(2);
  });

  it("allows options to override traveler count", () => {
    const plan = buildPlan("trip for 4 people", { travelers: 6 });
    expect(plan.travelers).toBe(6);
  });

  it("parses day count from prompt", () => {
    const plan = buildPlan("A 7-day trip to Manali");
    expect(plan.days.length).toBe(7);
    expect(plan.nights).toBe(6);
  });

  it("clamps day count between 2 and 10 days", () => {
    // Below minimum (1 day should clamp to 2)
    const shortPlan = buildPlan("1-day quick getaway");
    expect(shortPlan.days.length).toBe(2);

    // Above maximum (15 days should clamp to 10)
    const longPlan = buildPlan("15-day luxury tour");
    expect(longPlan.days.length).toBe(10);
  });

  it("verifies budget breakdown sums up to the total budget", () => {
    const testBudgets = [25000, 35000, 50000, 80000, 120000];

    for (const budget of testBudgets) {
      const plan = buildPlan("Test trip", { budget });
      const breakdownSum = plan.breakdown.reduce((sum, item) => sum + item.amount, 0);

      // Breakdown is 30% + 35% + 20% + 10% + 5% = 100%
      // Allow +/- 2 tolerance due to individual Math.round rounding
      expect(Math.abs(breakdownSum - budget)).toBeLessThanOrEqual(2);
    }
  });

  it("identifies destination categories accurately", () => {
    const beachPlan = buildPlan("5 days in Goa beach with friends");
    expect(beachPlan.title).toContain("Goa");

    const mountainPlan = buildPlan("5 days in Kashmir valley");
    expect(mountainPlan.title).toContain("Kashmir");

    const intlPlan = buildPlan("7 days in Japan exploring Tokyo");
    expect(intlPlan.title).toContain("Japan");
  });

  it("calculates carbon footprint estimates correctly", () => {
    expect(carbonFor("Japan")).toBe(1650);
    expect(carbonFor("Goa")).toBe(450);
    expect(carbonFor("Manali")).toBe(45);
  });
});
