import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Sparkles, Trash2, ArrowRight, Compass } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { destinations } from "@/data/travel";
import { smartTrip, useSmartTrip } from "@/lib/smarttrip-store";

interface WishlistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishlistSheet({ open, onOpenChange }: WishlistSheetProps) {
  const { wishlist } = useSmartTrip();
  const navigate = useNavigate();

  // Find destinations that match wishlist IDs
  const wishlistedItems = destinations.filter((d) => wishlist.includes(d.id));

  const handleRemove = (id: string, name: string) => {
    smartTrip.toggleWish(id);
    toast.success(`Removed ${name} from your wishlist`);
  };

  const handlePlanTrip = (name: string) => {
    onOpenChange(false);
    navigate({
      to: "/ai-planner",
      search: { q: `Plan a trip to ${name}` },
    });
  };

  const totalEstimated = wishlistedItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/50 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <Heart className="size-5 fill-rose-500" />
              </span>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">Wishlist</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {wishlistedItems.length}{" "}
                  {wishlistedItems.length === 1 ? "destination saved" : "destinations saved"}
                </SheetDescription>
              </div>
            </div>
            {wishlistedItems.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-foreground">
                Est. ₹{totalEstimated.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground/60 shadow-inner">
                <Heart className="size-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-base">Your wishlist is empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Discover breathtaking destinations across India and beyond, and tap the heart icon
                  to save them here for later.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 text-xs font-semibold mt-2"
                asChild
                onClick={() => onOpenChange(false)}
              >
                <Link to="/explore">
                  <Compass className="size-3.5" />
                  Explore Destinations
                </Link>
              </Button>
            </div>
          ) : (
            wishlistedItems.map((dest) => (
              <div
                key={dest.id}
                className="group relative flex gap-3.5 p-3 rounded-2xl border border-border/60 bg-card/60 hover:bg-card hover:shadow-soft transition-all duration-200"
              >
                <Link
                  to="/destination/$id"
                  params={{ id: dest.id }}
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 overflow-hidden rounded-xl size-20 cursor-pointer"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={80}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      to="/destination/$id"
                      params={{ id: dest.id }}
                      onClick={() => onOpenChange(false)}
                      className="cursor-pointer group-hover:text-primary transition-colors"
                    >
                      <h4 className="font-semibold text-sm text-foreground truncate leading-tight">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">{dest.region}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(dest.id, dest.name)}
                      className="text-muted-foreground/50 hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors"
                      title="Remove from wishlist"
                      aria-label={`Remove ${dest.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground block leading-none">
                        Est. from
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        ₹{dest.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handlePlanTrip(dest.name)}
                      className="h-7 text-[11px] rounded-lg px-2.5 gap-1.5 font-medium shadow-none"
                    >
                      <Sparkles className="size-3" />
                      Plan Trip
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistedItems.length > 0 && (
          <div className="p-4 border-t border-border/50 bg-secondary/30 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 rounded-xl text-xs"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/explore">
                Explore More
                <ArrowRight className="size-3 ml-1" />
              </Link>
            </Button>
            <Button
              variant="hero"
              size="sm"
              className="flex-1 rounded-xl text-xs gap-1.5"
              onClick={() => {
                onOpenChange(false);
                navigate({ to: "/ai-planner" });
              }}
            >
              <Sparkles className="size-3.5" />
              AI Itinerary
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
