import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  GripVertical,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
  Sparkles,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { GeneratedPlan } from "@/lib/trip-plan";
import { cn } from "@/lib/utils";

export interface ItineraryItem {
  id: string;
  text: string;
}

export interface ItineraryDay {
  day: string;
  title: string;
  items: ItineraryItem[];
}

interface ItineraryEditorProps {
  plan: GeneratedPlan;
  onPlanChange: (updatedPlan: GeneratedPlan) => void;
  className?: string;
}

// Helper to convert plan days to internal state with stable IDs
function convertToItineraryDays(days: GeneratedPlan["days"]): ItineraryDay[] {
  return days.map((d, dIdx) => ({
    day: d.day,
    title: d.title,
    items: d.items.map((text, iIdx) => ({
      id: `item-${dIdx}-${iIdx}-${text.slice(0, 12).replace(/[^a-zA-Z0-9]/g, "")}-${Math.random().toString(36).slice(2, 6)}`,
      text,
    })),
  }));
}

// Helper to serialize internal state back to GeneratedPlan days
function serializeItineraryDays(days: ItineraryDay[]): GeneratedPlan["days"] {
  return days.map((d) => ({
    day: d.day,
    title: d.title,
    items: d.items.map((it) => it.text),
  }));
}

export function ItineraryEditor({ plan, onPlanChange, className }: ItineraryEditorProps) {
  const [days, setDays] = useState<ItineraryDay[]>(() => convertToItineraryDays(plan.days));
  const [activeItem, setActiveItem] = useState<{ id: string; text: string } | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [addingDayIdx, setAddingDayIdx] = useState<number | null>(null);
  const [newActivityText, setNewActivityText] = useState("");

  // Sync state if plan changes from outside (e.g., AI re-generation)
  const lastPlanRef = useRef(plan);
  useEffect(() => {
    if (lastPlanRef.current !== plan) {
      lastPlanRef.current = plan;
      setDays(convertToItineraryDays(plan.days));
    }
  }, [plan]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const commitDays = (newDays: ItineraryDay[]) => {
    setDays(newDays);
    const updatedPlan: GeneratedPlan = {
      ...plan,
      days: serializeItineraryDays(newDays),
    };
    onPlanChange(updatedPlan);
  };

  const findDayIndex = (id: string, currentDays: ItineraryDay[] = days): number => {
    // Check if id matches day container identifier
    const dayMatch = currentDays.findIndex((d) => `day-${d.day}` === id || d.day === id);
    if (dayMatch !== -1) return dayMatch;
    // Check if id is an item inside a day
    return currentDays.findIndex((d) => d.items.some((it) => it.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    for (const d of days) {
      const found = d.items.find((i) => i.id === activeId);
      if (found) {
        setActiveItem(found);
        break;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceDayIdx = findDayIndex(activeId);
    const targetDayIdx = findDayIndex(overId);

    if (sourceDayIdx === -1 || targetDayIdx === -1 || sourceDayIdx === targetDayIdx) {
      return;
    }

    setDays((prevDays) => {
      const sourceDay = prevDays[sourceDayIdx];
      const targetDay = prevDays[targetDayIdx];
      if (!sourceDay || !targetDay) return prevDays;

      const itemToMove = sourceDay.items.find((i) => i.id === activeId);
      if (!itemToMove) return prevDays;

      const newSourceItems = sourceDay.items.filter((i) => i.id !== activeId);

      const overItemIdx = targetDay.items.findIndex((i) => i.id === overId);
      const newTargetItems = [...targetDay.items];
      if (overItemIdx !== -1) {
        newTargetItems.splice(overItemIdx, 0, itemToMove);
      } else {
        newTargetItems.push(itemToMove);
      }

      const next = [...prevDays];
      next[sourceDayIdx] = { ...sourceDay, items: newSourceItems };
      next[targetDayIdx] = { ...targetDay, items: newTargetItems };
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) {
      commitDays(days);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceDayIdx = findDayIndex(activeId);
    const targetDayIdx = findDayIndex(overId);

    if (sourceDayIdx !== -1 && sourceDayIdx === targetDayIdx) {
      const day = days[sourceDayIdx];
      if (day) {
        const oldIndex = day.items.findIndex((i) => i.id === activeId);
        const newIndex = day.items.findIndex((i) => i.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newItems = arrayMove(day.items, oldIndex, newIndex);
          const next = [...days];
          next[sourceDayIdx] = { ...day, items: newItems };
          commitDays(next);
          toast.success("Activity reordered", { duration: 1500 });
          return;
        }
      }
    }

    commitDays(days);
    toast.success("Itinerary updated", { duration: 1500 });
  };

  const handleStartEdit = (item: ItineraryItem) => {
    setEditingItemId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = (dayIdx: number, itemId: string) => {
    if (!editText.trim()) {
      toast.error("Activity description cannot be empty");
      return;
    }

    const targetDay = days[dayIdx];
    if (!targetDay) return;

    const nextDays = [...days];
    nextDays[dayIdx] = {
      ...targetDay,
      items: targetDay.items.map((it) =>
        it.id === itemId ? { ...it, text: editText.trim() } : it,
      ),
    };

    setEditingItemId(null);
    setEditText("");
    commitDays(nextDays);
    toast.success("Activity updated");
  };

  const handleDeleteItem = (dayIdx: number, itemIdx: number) => {
    const targetDay = days[dayIdx];
    if (!targetDay) return;

    const deletedItem = targetDay.items[itemIdx];
    if (!deletedItem) return;

    const nextDays = [...days];
    nextDays[dayIdx] = {
      ...targetDay,
      items: targetDay.items.filter((_, idx) => idx !== itemIdx),
    };

    commitDays(nextDays);

    toast("Activity removed", {
      description: `"${deletedItem.text.slice(0, 40)}${deletedItem.text.length > 40 ? "…" : ""}"`,
      action: {
        label: "Undo",
        onClick: () => {
          setDays((currDays) => {
            const restoredDays = [...currDays];
            if (!restoredDays[dayIdx]) return currDays;
            const restoredItems = [...restoredDays[dayIdx].items];
            restoredItems.splice(itemIdx, 0, deletedItem);
            restoredDays[dayIdx] = { ...restoredDays[dayIdx], items: restoredItems };
            commitDays(restoredDays);
            return restoredDays;
          });
          toast.success("Activity restored");
        },
      },
    });
  };

  const handleAddActivity = (dayIdx: number) => {
    if (!newActivityText.trim()) {
      toast.error("Please enter an activity name or description");
      return;
    }

    const targetDay = days[dayIdx];
    if (!targetDay) return;

    const newItem: ItineraryItem = {
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      text: newActivityText.trim(),
    };

    const nextDays = [...days];
    nextDays[dayIdx] = {
      ...targetDay,
      items: [...targetDay.items, newItem],
    };

    setAddingDayIdx(null);
    setNewActivityText("");
    commitDays(nextDays);
    toast.success("Activity added to " + targetDay.day);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <h4 className="font-display text-sm font-bold text-foreground">Interactive Itinerary</h4>
          <Badge
            variant="outline"
            className="text-[10px] bg-primary/5 text-primary border-primary/20"
          >
            Drag & Drop Enabled
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag cards to reorder within or across days. Add, edit, or remove anytime.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-5">
          {days.map((day, dayIdx) => (
            <div
              key={day.day}
              id={`day-${day.day}`}
              className="group rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:border-border hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {dayIdx + 1}
                  </span>
                  <div>
                    <h5 className="font-display text-sm font-bold text-foreground">
                      {day.day} — {day.title}
                    </h5>
                    <span className="text-[11px] text-muted-foreground">
                      {day.items.length} {day.items.length === 1 ? "activity" : "activities"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAddingDayIdx(addingDayIdx === dayIdx ? null : dayIdx);
                    setNewActivityText("");
                  }}
                  className="h-7 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded-full cursor-pointer"
                >
                  <Plus className="size-3.5" /> Add Activity
                </Button>
              </div>

              {/* Add Activity Inline Form */}
              {addingDayIdx === dayIdx ? (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-2 animate-in fade-in-50">
                  <Input
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    placeholder="E.g., Sunset photography walk along the ridge..."
                    className="h-8 text-xs bg-background"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddActivity(dayIdx);
                      } else if (e.key === "Escape") {
                        setAddingDayIdx(null);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                    onClick={() => handleAddActivity(dayIdx)}
                  >
                    <Check className="size-3.5" /> Add
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setAddingDayIdx(null)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : null}

              {/* Day's Sortable Items */}
              <SortableContext
                items={day.items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 min-h-[36px]">
                  {day.items.length === 0 ? (
                    <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
                      Drag activities here or click "+ Add Activity"
                    </div>
                  ) : (
                    day.items.map((item, itemIdx) => (
                      <SortableActivityCard
                        key={item.id}
                        item={item}
                        isEditing={editingItemId === item.id}
                        editText={editText}
                        onEditTextChange={setEditText}
                        onSaveEdit={() => handleSaveEdit(dayIdx, item.id)}
                        onCancelEdit={() => setEditingItemId(null)}
                        onStartEdit={() => handleStartEdit(item)}
                        onDelete={() => handleDeleteItem(dayIdx, itemIdx)}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-card p-3 shadow-xl opacity-90 scale-102">
              <GripVertical className="size-4 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground">{activeItem.text}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

interface SortableActivityCardProps {
  item: ItineraryItem;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (val: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

function SortableActivityCard({
  item,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
}: SortableActivityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 rounded-xl border border-primary/40 bg-card p-2 shadow-xs"
      >
        <Input
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          className="h-8 text-xs bg-background"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSaveEdit();
            } else if (e.key === "Escape") {
              onCancelEdit();
            }
          }}
        />
        <Button
          size="sm"
          className="h-8 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
          onClick={onSaveEdit}
        >
          <Check className="size-3.5" /> Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={onCancelEdit}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/80 px-3 py-2 text-xs transition-colors hover:border-primary/30 hover:bg-card shadow-xs",
        isDragging && "opacity-40 border-dashed border-primary",
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder activity"
          className="text-muted-foreground/60 hover:text-primary transition-colors cursor-grab active:cursor-grabbing p-0.5 rounded touch-none"
        >
          <GripVertical className="size-4 shrink-0" />
        </button>
        <span className="text-foreground text-xs leading-relaxed truncate group-hover:whitespace-normal">
          {item.text}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Edit activity"
          onClick={onStartEdit}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Edit Activity"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Delete activity"
          onClick={onDelete}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Delete Activity"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
