import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BSij73O2.mjs";
import { c as inr } from "./travel-Co-Z1Moz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useSmartTrip, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as SectionHeading, t as Reveal } from "./Reveal-YnFTFRXl.mjs";
import { B as Plus, Et as Coins, F as RefreshCw, Ft as CircleAlert, H as PiggyBank, W as Pencil, dt as History, m as Trash2 } from "../_libs/lucide-react.mjs";
import { a as DialogContent, c as DialogHeader, d as Input, i as Dialog, l as DialogTitle, o as DialogDescription, s as DialogFooter } from "./Navbar-G5xs2vbg.mjs";
import { t as Skeleton } from "./skeleton-BSPs1QJQ.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TripFund-B9rACDh3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK_ADD = [
	500,
	1e3,
	2500,
	5e3
];
function FundCard({ trip }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [contributeOpen, setContributeOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [editName, setEditName] = (0, import_react.useState)(trip.name);
	const [editTarget, setEditTarget] = (0, import_react.useState)(trip.target.toString());
	const [editDate, setEditDate] = (0, import_react.useState)(trip.targetDate);
	const [editMonths, setEditMonths] = (0, import_react.useState)(trip.monthsLeft.toString());
	const [editTravelers, setEditTravelers] = (0, import_react.useState)(trip.travelers.toString());
	const progress = Math.min(100, Math.round(trip.saved / trip.target * 100));
	const monthly = Math.max(0, Math.round((trip.target - trip.saved) / Math.max(1, trip.monthsLeft)));
	const done = trip.saved >= trip.target;
	const triggerCelebration = () => {
		confetti_module_default({
			particleCount: 120,
			spread: 75,
			origin: { y: .6 },
			colors: [
				"#38bdf8",
				"#818cf8",
				"#f43f5e",
				"#fbbf24",
				"#34d399"
			]
		});
	};
	const contribute = (value) => {
		if (!value || isNaN(value)) {
			toast.error("Please enter a valid amount");
			return;
		}
		if (value < 100) {
			toast.error("Minimum deposit is ₹100");
			return;
		}
		if (value > 1e7) {
			toast.error("Deposit amount exceeds single transaction limit (₹1,00,00,000)");
			return;
		}
		const res = smartTrip.contribute(trip.id, value);
		setAmount("");
		if (res.done) {
			triggerCelebration();
			toast.success(`🎉 100% Goal Reached for ${trip.name}!`, { description: `You've saved ${inr(trip.target)}. Time to book your flight!` });
		} else if (res.milestone) toast.success(`🎯 ${res.milestone}% Milestone Reached!`, { description: `${inr(value)} added. Total saved: ${inr(res.newSaved)} of ${inr(trip.target)}.` });
		else toast.success(`${inr(value)} added to ${trip.name}`, { description: `${inr(Math.max(0, trip.target - trip.saved - value))} remaining to target.` });
	};
	const handleEditSubmit = (e) => {
		e.preventDefault();
		const newTarget = Number(editTarget);
		const newMonths = Number(editMonths);
		const newTravelers = Number(editTravelers);
		if (!editName.trim()) {
			toast.error("Please enter a fund name");
			return;
		}
		if (isNaN(newTarget) || newTarget < 1e3) {
			toast.error("Target must be at least ₹1,000");
			return;
		}
		if (newTarget > 1e8) {
			toast.error("Target exceeds maximum allowed ₹10,00,00,000");
			return;
		}
		smartTrip.editFund(trip.id, {
			name: editName.trim(),
			target: newTarget,
			targetDate: editDate.trim() || "Flexible date",
			monthsLeft: Math.max(1, newMonths || 12),
			travelers: Math.max(1, newTravelers || 2)
		});
		setEditOpen(false);
		toast.success("Fund updated successfully");
	};
	const handleDelete = () => {
		smartTrip.removeFund(trip.id);
		setDeleteOpen(false);
		toast.message("Trip fund removed", { description: trip.name });
	};
	const contributions = smartTrip.getFundContributions(trip.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "surface-card overflow-hidden rounded-3xl border border-border/70 flex flex-col justify-between",
			"data-testid": `fund-card-${trip.id}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-44 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: trip.image,
						alt: trip.name,
						loading: "lazy",
						decoding: "async",
						width: 1024,
						height: 768,
						className: "size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 right-3 flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `View deposit history for ${trip.name}`,
								onClick: () => setHistoryOpen(true),
								className: "flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-primary cursor-pointer shadow-soft",
								title: "Deposit History",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Edit ${trip.name} fund`,
								onClick: () => setEditOpen(true),
								className: "flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-primary cursor-pointer shadow-soft",
								title: "Edit Fund",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Delete ${trip.name} fund`,
								onClick: () => setDeleteOpen(true),
								className: "flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground/80 backdrop-blur transition-transform hover:scale-110 hover:text-destructive cursor-pointer shadow-soft",
								title: "Delete Fund",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-4 bottom-4 text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl",
								children: trip.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold",
								children: trip.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs opacity-90",
								children: [
									trip.targetDate,
									" · ",
									trip.travelers,
									" ",
									trip.travelers === 1 ? "traveler" : "travelers"
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 flex-1 flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Saved"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-bold text-primary",
							children: inr(trip.saved)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground font-medium",
								children: "Target Goal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: inr(trip.target)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-2.5 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gradient-brand transition-all duration-700",
							style: { width: `${progress}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: done ? "text-emerald-600 font-bold" : "font-medium",
							children: done ? "🎉 100% Goal Reached!" : `${progress}% saved`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3 text-amber-500" }),
								" ",
								inr(monthly),
								"/mo"
							]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-3 border-t border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold text-muted-foreground",
								children: "Quick Deposits:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-7 px-2.5 text-xs rounded-full gap-1",
								"data-testid": "trip-fund-open",
								onClick: () => setContributeOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "size-3" }), " Contribute"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: QUICK_ADD.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": `trip-fund-quick-${v}`,
								onClick: () => contribute(v),
								className: "rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer",
								children: ["+", inr(v)]
							}, v))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: amount,
								type: "number",
								min: "100",
								max: "10000000",
								inputMode: "numeric",
								placeholder: "Custom deposit (₹)",
								"aria-label": `Add money to ${trip.name}`,
								className: "rounded-xl h-9 text-xs",
								onChange: (e) => setAmount(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										contribute(Number(amount));
									}
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "hero",
								size: "sm",
								className: "rounded-xl h-9 px-3 shrink-0 gap-1",
								"aria-label": "Add deposit",
								"data-testid": "contribute-submit",
								onClick: () => contribute(Number(amount)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Deposit"]
							})]
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: contributeOpen,
			onOpenChange: setContributeOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md rounded-3xl",
				"data-testid": "trip-fund-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-lg font-bold",
						children: ["Contribute to ", trip.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Add savings towards your target goal of ",
							inr(trip.target),
							"."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Amount (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "100",
								max: "10000000",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "e.g. 5000",
								className: "rounded-xl text-sm",
								"data-testid": "contribute-input"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: QUICK_ADD.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "rounded-full text-xs h-8",
								onClick: () => setAmount(v.toString()),
								children: ["+", inr(v)]
							}, v))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setContributeOpen(false),
						className: "rounded-xl",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "sm",
						className: "rounded-xl gap-1.5",
						"data-testid": "contribute-dialog-submit",
						onClick: () => {
							contribute(Number(amount) || 1e3);
							setContributeOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "size-3.5" }), " Contribute Now"]
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md rounded-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-lg font-bold",
					children: "Edit Trip Fund Goal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: [
						"Modify the target budget, destination name, or duration for ",
						trip.name,
						"."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleEditSubmit,
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: "Fund Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editName,
								onChange: (e) => setEditName(e.target.value),
								className: "rounded-xl text-sm",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Target Budget (₹)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "1000",
									value: editTarget,
									onChange: (e) => setEditTarget(e.target.value),
									className: "rounded-xl text-sm",
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Target Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editDate,
									onChange: (e) => setEditDate(e.target.value),
									placeholder: "e.g. Oct 2027",
									className: "rounded-xl text-sm"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Months Left"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "1",
									max: "120",
									value: editMonths,
									onChange: (e) => setEditMonths(e.target.value),
									className: "rounded-xl text-sm",
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Travelers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "1",
									max: "50",
									value: editTravelers,
									onChange: (e) => setEditTravelers(e.target.value),
									className: "rounded-xl text-sm",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "hero",
								className: "rounded-xl text-xs",
								children: "Save Changes"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: historyOpen,
			onOpenChange: setHistoryOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md rounded-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-lg font-bold flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-primary" }),
							"Deposit History — ",
							trip.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Total accumulated savings: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-primary",
								children: inr(trip.saved)
							}),
							" ",
							"of ",
							inr(trip.target),
							"."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-72 overflow-y-auto divide-y divide-border/40 py-2",
						children: contributions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-8 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-8 mx-auto mb-2 text-muted-foreground/50" }), "No deposits logged yet for this trip fund."]
						}) : contributions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: c.note || "Deposit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: new Date(c.createdAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full",
								children: ["+", inr(c.amount)]
							})]
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setHistoryOpen(false),
						className: "rounded-xl text-xs w-full",
						children: "Close History"
					}) })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: deleteOpen,
			onOpenChange: setDeleteOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-sm rounded-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "text-lg font-bold text-destructive flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete Trip Fund?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: [
						"Are you sure you want to delete your ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: trip.name }),
						" savings fund? This will remove the fund and its deposit log."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 pt-2 sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setDeleteOpen(false),
						className: "rounded-xl text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "destructive",
						onClick: handleDelete,
						className: "rounded-xl text-xs",
						children: "Delete Fund"
					})]
				})]
			})
		})
	] });
}
function TripFund() {
	const { funds, isLoading, isError, refetch } = useSmartTrip();
	const [name, setName] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [targetDate, setTargetDate] = (0, import_react.useState)("");
	const totalSaved = funds.reduce((sum, f) => sum + f.saved, 0);
	const totalTarget = funds.reduce((sum, f) => sum + f.target, 0);
	const addTrip = () => {
		const amount = Number(target);
		if (!name.trim()) {
			toast.error("Please enter a trip name");
			return;
		}
		if (!amount || isNaN(amount) || amount < 1e3) {
			toast.error("Enter a target amount of at least ₹1,000");
			return;
		}
		if (amount > 1e8) {
			toast.error("Target amount cannot exceed ₹10,00,00,000");
			return;
		}
		smartTrip.addFund({
			name: name.trim(),
			target: amount,
			travelers: 2,
			monthsLeft: 12
		});
		setName("");
		setTarget("");
		setTargetDate("");
		toast.success("Trip fund created!", { description: "Start saving and we'll keep you on track." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "fund",
		className: "container-page py-24",
		"data-testid": "trip-fund-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Save for your future trip",
				title: "Make Your Dream Trip Real",
				subtitle: "Dream trackers, not bank statements. Watch your savings grow, celebrate milestones, and see when you'll be ready to take off."
			}),
			isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-8 text-destructive mx-auto mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold text-foreground",
						children: "Could not load trip funds"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 mb-4",
						children: "Failed to fetch your saved trip funds from the server."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch?.(),
						className: "rounded-full gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Retry"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "surface-card p-6 lg:col-span-1 rounded-3xl border border-border/70 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-12 items-center justify-center rounded-2xl bg-gradient-sunrise text-sunset-foreground shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-bold text-foreground",
							children: "Start a new dream"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Set a target and begin saving today."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground uppercase mb-1",
							htmlFor: "fund-name",
							children: "Trip name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fund-name",
							value: name,
							placeholder: "e.g. Swiss Alps Winter 2027",
							className: "rounded-xl text-sm",
							onChange: (e) => setName(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground uppercase mb-1",
							htmlFor: "fund-target",
							children: "Target amount (₹)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fund-target",
							type: "number",
							min: "1000",
							max: "100000000",
							inputMode: "numeric",
							placeholder: "e.g. 150000",
							className: "rounded-xl text-sm",
							value: target,
							onChange: (e) => setTarget(e.target.value)
						})] })]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 pt-4 border-t border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "hero",
							className: "w-full rounded-2xl gap-2",
							onClick: addTrip,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Create Dream Fund"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Dreams Tracked:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: funds.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Accumulated:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-primary font-bold",
										children: inr(totalSaved)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overall Target:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: inr(totalTarget)
									})]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:col-span-2",
					children: [isLoading && Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden rounded-3xl border border-border/70 p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-3/4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full rounded-xl" })
						]
					}, i)), !isLoading && funds.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FundCard, { trip: f })
					}, f.id))]
				})]
			})
		]
	});
}
//#endregion
export { TripFund as t };
