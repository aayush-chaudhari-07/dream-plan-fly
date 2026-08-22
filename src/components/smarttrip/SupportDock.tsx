import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Headset, LifeBuoy, MessageSquare, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SupportDock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div className="glass-panel w-72 animate-scale-in rounded-3xl p-4">
          <p className="font-display text-sm font-bold">Need Help?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            We're around 24/7 — pick what works for you.
          </p>
          <div className="mt-3 grid gap-2">
            <Button variant="hero" size="lg" asChild className="justify-start">
              <Link to="/ai-planner">
                <Sparkles /> Ask AI
              </Link>
            </Button>
            <Button
              variant="soft"
              size="lg"
              className="justify-start"
              onClick={() => toast("Help Center", { description: "Guides, refunds and FAQs." })}
            >
              <LifeBuoy /> Help Center
            </Button>
            <Button
              variant="soft"
              size="lg"
              className="justify-start"
              onClick={() =>
                toast.success("Support requested", { description: "An agent will call you in 5 min." })
              }
            >
              <MessageSquare /> Contact Support
            </Button>
          </div>
        </div>
      ) : null}
      <Button
        variant="hero"
        size="icon"
        aria-label="Support"
        className="size-14 rounded-full"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-6" /> : <Headset className="size-6" />}
      </Button>
    </div>
  );
}
