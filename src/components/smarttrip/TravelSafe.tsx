import { Shield, CheckCircle, MapPinned, Siren, Stethoscope } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const items = [
  {
    icon: Shield,
    title: "Verified stays & transport",
    description:
      "We only list partners with real reviews, valid licenses and 24/7 customer support.",
  },
  {
    icon: MapPinned,
    title: "Live location sharing",
    description:
      "Share your itinerary and live location with family so someone always knows where you are.",
  },
  {
    icon: Siren,
    title: "Emergency support",
    description:
      "One-tap emergency contacts, local helplines and nearby hospitals in every destination.",
  },
  {
    icon: Stethoscope,
    title: "Travel health tips",
    description:
      "Vaccination reminders, altitude advice and first-aid checklists tailored to your route.",
  },
];

export function TravelSafe() {
  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Travel safe"
        title="We've Got Your Back"
        subtitle="Safety is part of the plan. SmartTrip keeps you informed, connected and prepared."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <div className="surface-card h-full p-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-gradient-sky p-6 text-center sm:flex-row sm:text-left">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card shadow-soft">
            <CheckCircle className="size-6 text-leaf" />
          </div>
          <div>
            <p className="font-display font-bold">SmartTrip Safety Promise</p>
            <p className="text-sm text-muted-foreground">
              Every booking includes transparent cancellation, customer support and safety
              information for your destination.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
