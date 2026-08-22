import { Quote, Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const reviews = [
  {
    name: "Priya Sharma",
    handle: "@priya.travels",
    avatar: "P",
    rating: 5,
    text: "SmartTrip planned our entire Himachal trip in under 10 minutes. The budget breakdown was spot on and the hotels were beautiful.",
    trip: "Manali · 5 days",
  },
  {
    name: "Rohan Mehta",
    handle: "@rohanonroad",
    avatar: "R",
    rating: 5,
    text: "I used the trip fund feature to save for Japan. Seeing the progress bar fill up kept me motivated for 14 months. Finally booked today!",
    trip: "Japan · 2027",
  },
  {
    name: "Ananya & Team",
    handle: "@anyaescapades",
    avatar: "A",
    rating: 4,
    text: "The AI planner gave us a better itinerary than three travel agents. Love that it includes local food stops and realistic transport.",
    trip: "Kashmir · 7 days",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Traveler stories"
          title="Trips People Actually Took"
          subtitle="Real travelers, real plans, real memories."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 80}>
              <div className="surface-card relative h-full p-6">
                <Quote className="absolute top-5 right-5 size-8 text-muted/50" />
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.handle}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`size-3.5 ${s < review.rating ? "fill-sunset text-sunset" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">{review.text}</p>
                <p className="mt-4 text-xs font-semibold text-primary">{review.trip}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
