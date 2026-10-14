import { useState, useEffect } from "react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  CheckSquare,
  Compass,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  Lightbulb,
  MapPin,
  RotateCcw,
  Shield,
  Smile,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/client/components/ui/accordion";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import { Reveal, SectionHeading } from "@/client/components/Reveal";
import { cn } from "@/client/lib/utils";

interface ChecklistItem {
  id: string;
  category: "documents" | "health" | "packing" | "money" | "safety" | "etiquette" | "tips";
  title: string;
  description: string;
  icon: typeof FileText;
}

const STAGES = [
  {
    value: "before-you-go",
    title: "1. Before You Go",
    subtitle: "Documentation, medical readiness, and smart packing essentials",
    badge: "Pre-Departure",
    badgeColor: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
    items: [
      {
        id: "doc-id",
        category: "documents",
        title: "Passports, IDs & Digital Backups",
        description:
          "Valid government photo ID / passport (min. 6 months validity). Save offline copies on your phone and email backup copies to yourself.",
        icon: FileText,
      },
      {
        id: "doc-insurance",
        category: "documents",
        title: "Travel Insurance & Booking Vouchers",
        description:
          "Keep physical or offline PDF vouchers for flights, hotels, trains, and medical travel insurance with 24/7 assistance hotline.",
        icon: Briefcase,
      },
      {
        id: "health-meds",
        category: "health",
        title: "Prescription Medications & First Aid",
        description:
          "Pack daily medicines in original boxes with prescription. Include a compact kit with pain relievers, motion sickness tablets, ORS, and band-aids.",
        icon: Heart,
      },
      {
        id: "health-weather",
        category: "health",
        title: "Climate & Altitude Readiness",
        description:
          "Check destination weather forecast. If heading to high altitudes (>2,500m like Manali/Ladakh), carry Diamox and plan for 24h acclimatization.",
        icon: Shield,
      },
      {
        id: "pack-layers",
        category: "packing",
        title: "Versatile Layering & Footwear",
        description:
          "Pack moisture-wicking inner layers, weather-proof outerwear, and already broken-in walking shoes to prevent blisters on day one.",
        icon: Compass,
      },
      {
        id: "pack-tech",
        category: "packing",
        title: "Universal Adapters & Power Bank",
        description:
          "Bring a 10,000–20,000mAh power bank (always pack in cabin baggage) and a universal multi-pin adapter with surge protection.",
        icon: Zap,
      },
    ] as ChecklistItem[],
  },
  {
    value: "during-your-trip",
    title: "2. During Your Trip",
    subtitle: "Money handling, transit security, and respecting local cultures",
    badge: "On the Ground",
    badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    items: [
      {
        id: "money-cards",
        category: "money",
        title: "Payment Separation & Emergency Cash",
        description:
          "Distribute funds across 2 cards and keep emergency local cash in a separate pocket. Use UPI/tap-and-pay for daily street expenses.",
        icon: CreditCard,
      },
      {
        id: "money-scams",
        category: "money",
        title: "Fare Negotiation & Meter Verification",
        description:
          "Always confirm taxi/auto rates upfront or use ride-hailing apps (Ola, Uber). Avoid unsolicited airport arrival guides offering unverified deals.",
        icon: AlertCircle,
      },
      {
        id: "safety-emergency",
        category: "safety",
        title: "Emergency Contacts & Live Sharing",
        description:
          "Save local emergency numbers (112 in India / 911 / 999). Share your live location with at least one family member or close friend during transit.",
        icon: Shield,
      },
      {
        id: "safety-bags",
        category: "safety",
        title: "Baggage Vigilance in Crowded Areas",
        description:
          "In crowded bazaars and train stations, wear your daypack in front and secure zippers with carabiners or clips.",
        icon: Briefcase,
      },
      {
        id: "etiquette-dress",
        category: "etiquette",
        title: "Sacred Site Modesty & Footwear Rules",
        description:
          "Cover shoulders and knees when visiting temples, mosques, monasteries, and churches. Remove footwear and silence mobile devices before entering.",
        icon: Smile,
      },
      {
        id: "etiquette-photo",
        category: "etiquette",
        title: "Photography Courtesy & Permissions",
        description:
          "Always ask permission before taking close-up portraits of locals, monks, or children. Respect 'No Photography' signs inside heritage shrines.",
        icon: MapPin,
      },
    ] as ChecklistItem[],
  },
  {
    value: "smart-tips",
    title: "3. Smart Tips & Traveler Hacks",
    subtitle: "Cost-cutting secrets, transit hacks, and sustainable travel",
    badge: "Pro Secrets",
    badgeColor: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    items: [
      {
        id: "tip-food",
        category: "tips",
        title: "Eat Where Locals Queue",
        description:
          "High turnover means fresh food and genuine flavors. Look for busy local thali joints, bakeries, and street vendors with active cooking fires.",
        icon: Lightbulb,
      },
      {
        id: "tip-maps",
        category: "tips",
        title: "Offline Google Maps & Translation",
        description:
          "Download offline maps for your destination city on Google Maps before landing. Pin your hotel location so you can navigate without cellular data.",
        icon: MapPin,
      },
      {
        id: "tip-bottles",
        category: "tips",
        title: "Carry a Reusable Water Flask",
        description:
          "Refill filtered water at hotels and airport lounges to eliminate single-use plastic waste and save hundreds of rupees throughout your trip.",
        icon: Heart,
      },
      {
        id: "tip-timing",
        category: "tips",
        title: "Sunrise Monument Visits",
        description:
          "Popular monuments and viewpoints (like Taj Mahal, Rohtang Pass, Forts) are least crowded in the first 90 minutes after sunrise. Avoid midday queues.",
        icon: Sparkles,
      },
    ] as ChecklistItem[],
  },
];

const CHECKLIST_STORAGE_KEY = "smarttrip.travel_guide_checklist";

export function QuickTravelGuide({ compact = false }: { compact?: boolean }) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleItem = (id: string) => {
    const next = checkedIds.includes(id) ? checkedIds.filter((x) => x !== id) : [...checkedIds, id];
    setCheckedIds(next);
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const resetAll = () => {
    setCheckedIds([]);
    try {
      localStorage.removeItem(CHECKLIST_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const allItemsCount = STAGES.reduce((acc, curr) => acc + curr.items.length, 0);
  const completedCount = checkedIds.length;
  const progressPercent = Math.round((completedCount / allItemsCount) * 100);

  return (
    <section className={compact ? "py-4" : "py-16 bg-secondary/30 relative overflow-hidden"}>
      <div className="container-page max-w-5xl">
        {!compact && (
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <SectionHeading
                eyebrow="Smart Preparation"
                title="Quick Travel Guide & Checklist"
                subtitle="Practical advice curated by seasoned travelers: from essential document checks to local customs and money-saving hacks."
              />

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">
                    {completedCount} of {allItemsCount} ready
                  </p>
                  <div className="w-28 h-2 rounded-full bg-secondary overflow-hidden mt-1 border border-border/40">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {completedCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    title="Reset all checkboxes"
                  >
                    <RotateCcw className="size-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {compact && (
          <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                Traveler Guide & Checklists
              </h3>
              <p className="text-xs text-muted-foreground">
                Tick off essentials as you prepare for your departure.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {completedCount}/{allItemsCount} completed
              </span>
              {completedCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetAll}
                  className="size-7"
                  title="Reset"
                >
                  <RotateCcw className="size-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        <Accordion type="multiple" defaultValue={["before-you-go"]} className="space-y-4">
          {STAGES.map((stage) => {
            const stageCheckedCount = stage.items.filter((i) => checkedIds.includes(i.id)).length;
            const stageTotal = stage.items.length;
            const isStageDone = stageCheckedCount === stageTotal;

            return (
              <AccordionItem
                key={stage.value}
                value={stage.value}
                className="border border-border/60 rounded-3xl bg-card/80 backdrop-blur-sm overflow-hidden shadow-soft px-2"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline cursor-pointer">
                  <div className="flex flex-wrap items-center gap-3 text-left flex-1 mr-2">
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                        stage.badgeColor,
                      )}
                    >
                      {stage.badge}
                    </span>
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                        {stage.title}
                        {isStageDone && (
                          <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-500/20" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {stage.subtitle}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground mr-2">
                      {stageCheckedCount}/{stageTotal} checked
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-5 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stage.items.map((item) => {
                      const isChecked = checkedIds.includes(item.id);
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={cn(
                            "flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none",
                            isChecked
                              ? "bg-primary/5 border-primary/30 text-foreground"
                              : "bg-secondary/30 border-border/50 hover:bg-secondary/60 text-foreground/90",
                          )}
                        >
                          <button
                            type="button"
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-lg border transition-colors",
                              isChecked
                                ? "bg-primary border-primary text-primary-foreground shadow-xs"
                                : "border-border bg-card text-transparent",
                            )}
                            aria-label={`Toggle ${item.title}`}
                          >
                            <CheckSquare className="size-3.5" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Icon className="size-3.5 text-primary shrink-0" />
                              <h5
                                className={cn(
                                  "font-semibold text-xs leading-snug",
                                  isChecked && "line-through text-muted-foreground",
                                )}
                              >
                                {item.title}
                              </h5>
                            </div>
                            <p
                              className={cn(
                                "text-[11px] text-muted-foreground mt-1 leading-relaxed",
                                isChecked && "opacity-75",
                              )}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
