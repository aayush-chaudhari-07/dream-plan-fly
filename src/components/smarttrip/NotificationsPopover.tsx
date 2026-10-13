import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck, Plane, Sparkles, TrendingDown, Trophy, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  smartTrip,
  useSmartTrip,
  type NotificationType,
  type StoredNotification,
} from "@/lib/smarttrip-store";
import { cn } from "@/lib/utils";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "booking":
      return <Plane className="size-4 text-emerald-600" />;
    case "milestone":
      return <Trophy className="size-4 text-amber-500" />;
    case "price_drop":
      return <TrendingDown className="size-4 text-sky-500" />;
    default:
      return <Sparkles className="size-4 text-primary" />;
  }
}

function getNotificationBadgeClass(type: NotificationType) {
  switch (type) {
    case "booking":
      return "bg-emerald-500/10 text-emerald-600";
    case "milestone":
      return "bg-amber-500/10 text-amber-600";
    case "price_drop":
      return "bg-sky-500/10 text-sky-600";
    default:
      return "bg-primary/10 text-primary";
  }
}

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationsPopoverProps {
  children?: React.ReactNode;
}

export function NotificationsPopover({ children }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const { notifications } = useSmartTrip();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    smartTrip.markAllNotificationsRead();
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (n: StoredNotification) => {
    if (!n.read) {
      smartTrip.markNotificationRead(n.id);
    }
    if (n.link) {
      setOpen(false);
      navigate({ href: n.link });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative rounded-full text-foreground/70 hover:text-foreground"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-84 sm:w-96 rounded-2xl p-0 shadow-elevated border-border/70 overflow-hidden bg-card/95 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between p-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Bell className="size-5" />
              </div>
              <p className="text-sm font-medium text-foreground">You are all caught up!</p>
              <p className="text-xs text-muted-foreground">
                No new trip milestones, bookings, or price drop alerts.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "p-3.5 transition-colors cursor-pointer flex gap-3 items-start hover:bg-secondary/60",
                  !n.read && "bg-primary/5",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl",
                    getNotificationBadgeClass(n.type),
                  )}
                >
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        "text-xs font-semibold truncate leading-tight",
                        !n.read ? "text-foreground font-bold" : "text-foreground/80",
                      )}
                    >
                      {n.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span
                    className="mt-1 size-2 rounded-full bg-primary shrink-0"
                    aria-label="Unread"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
