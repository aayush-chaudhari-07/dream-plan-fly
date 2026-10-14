import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Lock,
  MessageSquarePlus,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSmartTrip } from "@/lib/smarttrip-store";
import { fetchReviewsFn, submitReviewFn } from "@/lib/server/trip-actions";
import { Reveal, SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  rating: number;
  destination: string;
  title: string;
  comment: string;
  authorName: string;
  authorAvatar?: string | undefined;
  tripTitle?: string | undefined;
  verified: boolean;
  createdAt: number;
}

export function ReviewsSection() {
  const queryClient = useQueryClient();
  const state = useSmartTrip();
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [destination, setDestination] = useState("Himachal Pradesh");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [tripTitle, setTripTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery<ReviewItem[]>({
    queryKey: ["traveler-reviews"],
    queryFn: async () => {
      const res = await fetchReviewsFn();
      return res as ReviewItem[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await submitReviewFn({
        data: {
          rating,
          destination: destination.trim(),
          title: title.trim(),
          comment: comment.trim(),
          tripTitle: tripTitle.trim() || undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Review posted successfully!", {
        description: "Thank you for sharing your verified travel story.",
      });
      queryClient.invalidateQueries({ queryKey: ["traveler-reviews"] });
      setModalOpen(false);
      setTitle("");
      setComment("");
      setTripTitle("");
      setRating(5);
      setErrorMessage(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to submit review.";
      setErrorMessage(msg);
      toast.error(msg);
    },
  });

  const handleOpenModal = () => {
    setErrorMessage(null);
    if (!state.isAuthenticated) {
      toast.info("Please sign in to write a review", {
        description:
          "Only travelers with confirmed bookings or saved trips can submit verified reviews.",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter a headline for your review.");
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMessage("Review details must be at least 10 characters.");
      return;
    }

    submitMutation.mutate();
  };

  return (
    <section className="bg-surface py-24 relative overflow-hidden" id="reviews">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionHeading
              eyebrow="Traveler Stories"
              title="Real Reviews from Verified Travelers"
              subtitle="No sponsored fluff. Authentic feedback from travelers who booked and explored with SmartTrip."
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="hero"
              onClick={handleOpenModal}
              className="gap-2 rounded-full cursor-pointer shadow-soft"
            >
              <MessageSquarePlus className="size-4" />
              Write a Review
            </Button>
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card h-64 animate-pulse p-6 rounded-3xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="surface-card p-12 text-center rounded-3xl border border-dashed border-border/80">
            <Sparkles className="size-10 text-primary mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold">Be the first to share your journey!</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto mb-5">
              Have you explored a destination with SmartTrip? Write a verified review to help fellow
              travelers plan their dream adventures.
            </p>
            <Button variant="outline" onClick={handleOpenModal} className="rounded-full">
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 70}>
                <article className="surface-card relative flex h-full flex-col justify-between p-6 rounded-3xl border border-border/70 hover:border-primary/30 transition-all hover:shadow-soft">
                  <Quote className="absolute top-5 right-5 size-8 text-muted/30 pointer-events-none" />

                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      {review.authorAvatar ? (
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          loading="lazy"
                          decoding="async"
                          width={44}
                          height={44}
                          className="size-11 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="flex size-11 items-center justify-center rounded-full bg-gradient-brand font-display font-bold text-primary-foreground shadow-xs">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-display text-sm font-bold text-foreground">
                            {review.authorName}
                          </p>
                          {review.verified ? (
                            <span
                              title="Verified Traveler (Booking or Trip Confirmed)"
                              className="text-primary flex items-center"
                            >
                              <ShieldCheck className="size-4" />
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">{review.destination}</p>
                      </div>
                    </div>

                    {/* Stars & Title */}
                    <div className="mt-3.5 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={cn(
                            "size-3.5",
                            s < review.rating ? "fill-sunset text-sunset" : "text-muted",
                          )}
                        />
                      ))}
                      {review.verified ? (
                        <Badge
                          variant="outline"
                          className="ml-2 text-[10px] bg-primary/5 text-primary border-primary/20 py-0 px-1.5 font-normal"
                        >
                          Verified Traveler
                        </Badge>
                      ) : null}
                    </div>

                    <h4 className="mt-2.5 font-display text-sm font-bold text-foreground">
                      {review.title}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      "{review.comment}"
                    </p>
                  </div>

                  {review.tripTitle ? (
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">{review.tripTitle}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <DialogTitle className="font-display text-xl font-bold">
                Write a Verified Traveler Review
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Reviews are verified against confirmed bookings and saved itineraries to maintain
              community trust.
            </DialogDescription>
          </DialogHeader>

          {!state.isAuthenticated ? (
            <div className="my-4 rounded-2xl border border-border bg-card p-5 text-center">
              <Lock className="size-8 text-primary mx-auto mb-2" />
              <p className="font-display text-sm font-bold">Authentication Required</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                To prevent spam and keep reviews genuine, only logged-in travelers with at least one
                booking or saved trip can post.
              </p>
              <Button variant="hero" asChild className="rounded-full">
                <Link
                  to="/login"
                  search={{
                    redirect: typeof window !== "undefined" ? window.location.pathname : "/",
                  }}
                >
                  Sign In / Create Account
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 my-2">
              {errorMessage ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-muted-foreground transition-transform hover:scale-115 cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "size-6 transition-colors",
                          star <= (hoverRating || rating)
                            ? "fill-sunset text-sunset"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Destination
                </label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="E.g., Himachal Pradesh, Goa, Kashmir, Japan"
                  required
                  className="rounded-xl text-xs h-9"
                />
              </div>

              {/* Trip Label (optional) */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Trip Name or Duration (Optional)
                </label>
                <Input
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  placeholder="E.g., 5-day Monsoon Road Trip"
                  className="rounded-xl text-xs h-9"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Review Headline
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience in one sentence"
                  required
                  className="rounded-xl text-xs h-9"
                />
              </div>

              {/* Details */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Your Review
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Tell us about the itinerary pacing, local recommendations, stays, or budget accuracy..."
                  required
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  disabled={submitMutation.isPending}
                  className="rounded-full text-xs h-9 gap-1.5"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
