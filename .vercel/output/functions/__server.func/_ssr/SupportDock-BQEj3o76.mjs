import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as submitSupportTicketFn } from "./smarttrip-store-B4h7bmlO.mjs";
import { K as MessageSquare, Nt as CircleCheck, O as ShieldAlert, U as PhoneCall, it as LifeBuoy, pt as Headset, r as X, tt as LoaderCircle, x as Sparkles } from "../_libs/lucide-react.mjs";
import { a as DialogContent, c as DialogHeader, d as Input, i as Dialog, l as DialogTitle, o as DialogDescription, s as DialogFooter } from "./Navbar-G5xs2vbg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SupportDock-BQEj3o76.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function SupportDock() {
	const [dockOpen, setDockOpen] = (0, import_react.useState)(false);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)("general");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [ticketRef, setTicketRef] = (0, import_react.useState)(null);
	const handleOpenContactModal = (initialCategory = "general") => {
		setCategory(initialCategory);
		setTicketRef(null);
		setDockOpen(false);
		setModalOpen(true);
	};
	const handleSubmitTicket = async (e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !subject.trim() || message.trim().length < 10) {
			toast.error("Please fill in all fields (message must be at least 10 characters)");
			return;
		}
		setIsSubmitting(true);
		try {
			const res = await submitSupportTicketFn({ data: {
				name: name.trim(),
				email: email.trim().toLowerCase(),
				category,
				subject: subject.trim(),
				message: message.trim()
			} });
			setTicketRef(res.reference);
			toast.success("Support ticket created!", { description: `Reference #${res.reference}. Our team has received your inquiry.` });
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to submit support request.";
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 print:hidden",
		children: [dockOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-panel w-80 animate-scale-in rounded-3xl p-5 shadow-elevated border border-border/70",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-2 border-b border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-bold text-foreground",
							children: "SmartTrip Support"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDockOpen(false),
						className: "text-muted-foreground hover:text-foreground text-xs p-1",
						"aria-label": "Close support menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground leading-relaxed",
					children: "We're available 24/7 across travel planning, booking assistance, and urgent helplines."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3.5 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "sm",
							asChild: true,
							className: "justify-start rounded-xl h-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ai-planner",
								onClick: () => setDockOpen(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 mr-2" }), " Ask AI Travel Planner"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							size: "sm",
							asChild: true,
							className: "justify-start rounded-xl h-10 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/faq",
								onClick: () => setDockOpen(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-4 mr-2 text-primary" }), " Help Center & FAQ"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "soft",
							size: "sm",
							className: "justify-start rounded-xl h-10 text-xs cursor-pointer",
							onClick: () => handleOpenContactModal("general"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4 mr-2 text-primary" }), " Open Support Ticket"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "justify-start rounded-xl h-10 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer",
							onClick: () => handleOpenContactModal("emergency"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-4 mr-2 text-destructive" }), " 24/7 Emergency Hotline"]
						})
					]
				})
			]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "hero",
			size: "icon",
			"aria-label": "Open 24/7 Support Dock",
			className: "size-14 rounded-full shadow-elevated cursor-pointer transition-transform hover:scale-105",
			onClick: () => setDockOpen((v) => !v),
			children: dockOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "size-6" })
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: modalOpen,
		onOpenChange: setModalOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md rounded-3xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [category === "emergency" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: category === "emergency" ? "Urgent On-Trip Emergency Request" : "Contact SmartTrip Support"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: category === "emergency" ? "Priority dispatch desk for immediate medical, transit safety, or critical booking emergencies." : "Open a support ticket stored in our tracking system. Our team responds within 30–60 minutes."
				})] }),
				category === "emergency" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs flex items-center justify-between gap-3 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold",
						children: "Need Immediate Voice Contact?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] opacity-90",
						children: "Toll-free 24/7 helpline desk"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-7 text-xs border-destructive/40 bg-background text-destructive hover:bg-destructive/10",
						onClick: () => {
							navigator.clipboard.writeText("+911800762788");
							toast.success("Emergency hotline copied: +91 1800-762-788");
						},
						children: "+91 1800-762-788"
					})]
				}) : null,
				ticketRef ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center animate-in fade-in-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base font-bold text-foreground",
							children: "Ticket Created Successfully!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Your request has been logged in our support center."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 inline-flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-1.5 font-mono text-xs font-bold text-primary",
							children: ["Reference: #", ticketRef]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setModalOpen(false),
								className: "rounded-full text-xs",
								children: "Close Window"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitTicket,
					className: "space-y-3.5 my-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "Your Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Full name",
								required: true,
								className: "rounded-xl text-xs h-9"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com",
								required: true,
								className: "rounded-xl text-xs h-9"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "support-category",
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Inquiry Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "support-category",
							"aria-label": "Inquiry Category",
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "w-full rounded-xl border border-input bg-card px-3 h-9 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "general",
									children: "General Support"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "booking",
									children: "Booking / Voucher Issue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "modification",
									children: "Date Modification / PNR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cancellation",
									children: "Cancellation Request"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "refund",
									children: "Refund Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "emergency",
									children: "🚨 Urgent On-Trip Emergency"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Summary of request",
							required: true,
							className: "rounded-xl text-xs h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground block mb-1",
							children: "Message & Booking Reference"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: message,
							onChange: (e) => setMessage(e.target.value),
							rows: 3,
							placeholder: "Please describe what happened, including any booking reference codes (#ST-XXXX)...",
							required: true,
							className: "rounded-xl text-xs resize-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setModalOpen(false),
								className: "rounded-full text-xs h-9",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: category === "emergency" ? "destructive" : "hero",
								disabled: isSubmitting,
								className: "rounded-full text-xs h-9 gap-1.5",
								children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Submitting…"] }) : "Submit Ticket"
							})]
						})
					]
				})
			]
		})
	})] });
}
//#endregion
export { Textarea as n, SupportDock as t };
