import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { t as Badge } from "./badge-CNWERV3-.mjs";
import { a as PointerSensor, g as CSS, h as useSensors, i as KeyboardSensor, m as useSensor, n as DragOverlay, o as closestCenter, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Plus, Ut as Calendar, W as Pencil, m as Trash2, mt as GripVertical, r as X, zt as Check } from "../_libs/lucide-react.mjs";
import { d as Input } from "./Navbar-G5xs2vbg.mjs";
import { a as verticalListSortingStrategy, i as useSortable, n as arrayMove, r as sortableKeyboardCoordinates, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ItineraryEditor-C7art4hg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function convertToItineraryDays(days) {
	return days.map((d, dIdx) => ({
		day: d.day,
		title: d.title,
		items: d.items.map((text, iIdx) => ({
			id: `item-${dIdx}-${iIdx}-${text.slice(0, 12).replace(/[^a-zA-Z0-9]/g, "")}-${Math.random().toString(36).slice(2, 6)}`,
			text
		}))
	}));
}
function serializeItineraryDays(days) {
	return days.map((d) => ({
		day: d.day,
		title: d.title,
		items: d.items.map((it) => it.text)
	}));
}
function ItineraryEditor({ plan, onPlanChange, className }) {
	const [days, setDays] = (0, import_react.useState)(() => convertToItineraryDays(plan.days));
	const [activeItem, setActiveItem] = (0, import_react.useState)(null);
	const [editingItemId, setEditingItemId] = (0, import_react.useState)(null);
	const [editText, setEditText] = (0, import_react.useState)("");
	const [addingDayIdx, setAddingDayIdx] = (0, import_react.useState)(null);
	const [newActivityText, setNewActivityText] = (0, import_react.useState)("");
	const lastPlanRef = (0, import_react.useRef)(plan);
	(0, import_react.useEffect)(() => {
		if (lastPlanRef.current !== plan) {
			lastPlanRef.current = plan;
			setDays(convertToItineraryDays(plan.days));
		}
	}, [plan]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const commitDays = (newDays) => {
		setDays(newDays);
		onPlanChange({
			...plan,
			days: serializeItineraryDays(newDays)
		});
	};
	const findDayIndex = (id, currentDays = days) => {
		const dayMatch = currentDays.findIndex((d) => `day-${d.day}` === id || d.day === id);
		if (dayMatch !== -1) return dayMatch;
		return currentDays.findIndex((d) => d.items.some((it) => it.id === id));
	};
	const handleDragStart = (event) => {
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
	const handleDragOver = (event) => {
		const { active, over } = event;
		if (!over) return;
		const activeId = String(active.id);
		const overId = String(over.id);
		const sourceDayIdx = findDayIndex(activeId);
		const targetDayIdx = findDayIndex(overId);
		if (sourceDayIdx === -1 || targetDayIdx === -1 || sourceDayIdx === targetDayIdx) return;
		setDays((prevDays) => {
			const sourceDay = prevDays[sourceDayIdx];
			const targetDay = prevDays[targetDayIdx];
			if (!sourceDay || !targetDay) return prevDays;
			const itemToMove = sourceDay.items.find((i) => i.id === activeId);
			if (!itemToMove) return prevDays;
			const newSourceItems = sourceDay.items.filter((i) => i.id !== activeId);
			const overItemIdx = targetDay.items.findIndex((i) => i.id === overId);
			const newTargetItems = [...targetDay.items];
			if (overItemIdx !== -1) newTargetItems.splice(overItemIdx, 0, itemToMove);
			else newTargetItems.push(itemToMove);
			const next = [...prevDays];
			next[sourceDayIdx] = {
				...sourceDay,
				items: newSourceItems
			};
			next[targetDayIdx] = {
				...targetDay,
				items: newTargetItems
			};
			return next;
		});
	};
	const handleDragEnd = (event) => {
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
					next[sourceDayIdx] = {
						...day,
						items: newItems
					};
					commitDays(next);
					toast.success("Activity reordered", { duration: 1500 });
					return;
				}
			}
		}
		commitDays(days);
		toast.success("Itinerary updated", { duration: 1500 });
	};
	const handleStartEdit = (item) => {
		setEditingItemId(item.id);
		setEditText(item.text);
	};
	const handleSaveEdit = (dayIdx, itemId) => {
		if (!editText.trim()) {
			toast.error("Activity description cannot be empty");
			return;
		}
		const targetDay = days[dayIdx];
		if (!targetDay) return;
		const nextDays = [...days];
		nextDays[dayIdx] = {
			...targetDay,
			items: targetDay.items.map((it) => it.id === itemId ? {
				...it,
				text: editText.trim()
			} : it)
		};
		setEditingItemId(null);
		setEditText("");
		commitDays(nextDays);
		toast.success("Activity updated");
	};
	const handleDeleteItem = (dayIdx, itemIdx) => {
		const targetDay = days[dayIdx];
		if (!targetDay) return;
		const deletedItem = targetDay.items[itemIdx];
		if (!deletedItem) return;
		const nextDays = [...days];
		nextDays[dayIdx] = {
			...targetDay,
			items: targetDay.items.filter((_, idx) => idx !== itemIdx)
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
						restoredDays[dayIdx] = {
							...restoredDays[dayIdx],
							items: restoredItems
						};
						commitDays(restoredDays);
						return restoredDays;
					});
					toast.success("Activity restored");
				}
			}
		});
	};
	const handleAddActivity = (dayIdx) => {
		if (!newActivityText.trim()) {
			toast.error("Please enter an activity name or description");
			return;
		}
		const targetDay = days[dayIdx];
		if (!targetDay) return;
		const newItem = {
			id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
			text: newActivityText.trim()
		};
		const nextDays = [...days];
		nextDays[dayIdx] = {
			...targetDay,
			items: [...targetDay.items, newItem]
		};
		setAddingDayIdx(null);
		setNewActivityText("");
		commitDays(nextDays);
		toast.success("Activity added to " + targetDay.day);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-6", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-display text-sm font-bold text-foreground",
						children: "Interactive Itinerary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] bg-primary/5 text-primary border-primary/20",
						children: "Drag & Drop Enabled"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Drag cards to reorder within or across days. Add, edit, or remove anytime."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
			sensors,
			collisionDetection: closestCenter,
			onDragStart: handleDragStart,
			onDragOver: handleDragOver,
			onDragEnd: handleDragEnd,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-5",
				children: days.map((day, dayIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: `day-${day.day}`,
					className: "group rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:border-border hover:shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
									children: dayIdx + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
									className: "font-display text-sm font-bold text-foreground",
									children: [
										day.day,
										" — ",
										day.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [
										day.items.length,
										" ",
										day.items.length === 1 ? "activity" : "activities"
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setAddingDayIdx(addingDayIdx === dayIdx ? null : dayIdx);
									setNewActivityText("");
								},
								className: "h-7 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded-full cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add Activity"]
							})]
						}),
						addingDayIdx === dayIdx ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-2 animate-in fade-in-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: newActivityText,
									onChange: (e) => setNewActivityText(e.target.value),
									placeholder: "E.g., Sunset photography walk along the ridge...",
									className: "h-8 text-xs bg-background",
									autoFocus: true,
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddActivity(dayIdx);
										} else if (e.key === "Escape") setAddingDayIdx(null);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1",
									onClick: () => handleAddActivity(dayIdx),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Add"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-8 px-2 text-xs text-muted-foreground hover:text-foreground",
									onClick: () => setAddingDayIdx(null),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
							items: day.items.map((i) => i.id),
							strategy: verticalListSortingStrategy,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 min-h-[36px]",
								children: day.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground",
									children: "Drag activities here or click \"+ Add Activity\""
								}) : day.items.map((item, itemIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableActivityCard, {
									item,
									isEditing: editingItemId === item.id,
									editText,
									onEditTextChange: setEditText,
									onSaveEdit: () => handleSaveEdit(dayIdx, item.id),
									onCancelEdit: () => setEditingItemId(null),
									onStartEdit: () => handleStartEdit(item),
									onDelete: () => handleDeleteItem(dayIdx, itemIdx)
								}, item.id))
							})
						})
					]
				}, day.day))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, { children: activeItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border-2 border-primary bg-card p-3 shadow-xl opacity-90 scale-102",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-foreground",
					children: activeItem.text
				})]
			}) : null })]
		})]
	});
}
function SortableActivityCard({ item, isEditing, editText, onEditTextChange, onSaveEdit, onCancelEdit, onStartEdit, onDelete }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
	const style = {
		transform: CSS.Translate.toString(transform),
		transition
	};
	if (isEditing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style,
		className: "flex items-center gap-2 rounded-xl border border-primary/40 bg-card p-2 shadow-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: editText,
				onChange: (e) => onEditTextChange(e.target.value),
				className: "h-8 text-xs bg-background",
				autoFocus: true,
				onKeyDown: (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						onSaveEdit();
					} else if (e.key === "Escape") onCancelEdit();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "h-8 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1",
				onClick: onSaveEdit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Save"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "h-8 px-2 text-xs text-muted-foreground hover:text-foreground",
				onClick: onCancelEdit,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style,
		className: cn("group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/80 px-3 py-2 text-xs transition-colors hover:border-primary/30 hover:bg-card shadow-xs", isDragging && "opacity-40 border-dashed border-primary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 flex-1 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				...attributes,
				...listeners,
				"aria-label": "Drag to reorder activity",
				className: "text-muted-foreground/60 hover:text-primary transition-colors cursor-grab active:cursor-grabbing p-0.5 rounded touch-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4 shrink-0" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground text-xs leading-relaxed truncate group-hover:whitespace-normal",
				children: item.text
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Edit activity",
				onClick: onStartEdit,
				className: "flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer",
				title: "Edit Activity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Delete activity",
				onClick: onDelete,
				className: "flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer",
				title: "Delete Activity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
			})]
		})]
	});
}
//#endregion
export { ItineraryEditor };
