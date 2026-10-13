import { Bot, Heart, MapPin, Plane, Wallet } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const steps = [
  {
    icon: Bot,
    title: "Ask AI",
    description:
      "Tell SmartTrip where you want to go, your budget and your vibe. AI builds a plan in seconds.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: MapPin,
    title: "Explore",
    description:
      "Browse hand-picked destinations, compare real prices and save places you love to a wishlist.",
    color: "bg-teal text-teal-foreground",
  },
  {
    icon: Wallet,
    title: "Save",
    description:
      "Start a trip fund, track your progress and get reminders so your dream trip actually happens.",
    color: "bg-sunset text-sunset-foreground",
  },
  {
    icon: Plane,
    title: "Book & Go",
    description:
      "Book flights, stays, rentals and packages — then manage everything in one smart itinerary.",
    color: "bg-leaf text-leaf-foreground",
  },
];

export function HowItWorks() {
  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="How it works"
        title="Dream → Plan → Save → Travel"
        subtitle="A simple loop that turns your travel ideas into real trips."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 80}>
            <div className="surface-card relative h-full p-6">
              <div className="absolute top-4 right-4 font-display text-5xl font-bold text-muted/40">
                0{i + 1}
              </div>
              <div className={"flex size-12 items-center justify-center rounded-2xl " + step.color}>
                <step.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
