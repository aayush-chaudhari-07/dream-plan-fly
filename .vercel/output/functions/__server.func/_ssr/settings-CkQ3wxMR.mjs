import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as getExchangeRatesFn, m as updateProfileFn } from "./smarttrip-store-B4h7bmlO.mjs";
import { Et as Coins, Ht as Camera, It as ChevronUp, N as Save, Rt as ChevronDown, X as MapPin, ht as Globe, l as User, x as Sparkles, zt as Check } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-context-BwjyU4uq.mjs";
import { d as Input, f as Navbar, n as AvatarFallback, r as AvatarImage, t as Avatar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CkQ3wxMR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var PRESET_AVATARS = [
	{
		label: "Alpine Explorer",
		url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
	},
	{
		label: "Mountain Nomad",
		url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
	},
	{
		label: "Island Hopper",
		url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
	},
	{
		label: "City Wanderer",
		url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
	},
	{
		label: "Coastal Seeker",
		url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
	},
	{
		label: "Global Trekker",
		url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
	}
];
var POPULAR_CITIES = [
	"Mumbai",
	"Delhi",
	"Bengaluru",
	"Goa",
	"Hyderabad",
	"Kolkata",
	"London",
	"New York",
	"Tokyo",
	"Dubai"
];
var CURRENCIES = [
	{
		code: "INR",
		symbol: "₹",
		name: "Indian Rupee",
		supported: true
	},
	{
		code: "USD",
		symbol: "$",
		name: "US Dollar",
		supported: true
	},
	{
		code: "EUR",
		symbol: "€",
		name: "Euro",
		supported: true
	},
	{
		code: "GBP",
		symbol: "£",
		name: "British Pound",
		supported: true
	},
	{
		code: "JPY",
		symbol: "¥",
		name: "Japanese Yen",
		supported: true
	},
	{
		code: "AUD",
		symbol: "A$",
		name: "Australian Dollar",
		supported: true
	},
	{
		code: "CAD",
		symbol: "C$",
		name: "Canadian Dollar",
		supported: true
	},
	{
		code: "SGD",
		symbol: "S$",
		name: "Singapore Dollar",
		supported: true
	},
	{
		code: "AED",
		symbol: "د.إ",
		name: "UAE Dirham",
		supported: false
	}
];
function SettingsPage() {
	const { user, updateProfile } = useAuth();
	const navigate = useNavigate();
	user?.user_metadata;
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)("");
	const [homeCity, setHomeCity] = (0, import_react.useState)("Mumbai");
	const [currency, setCurrency] = (0, import_react.useState)("INR");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [ratesData, setRatesData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getExchangeRatesFn().then(setRatesData).catch((err) => console.warn("Could not load ECB rates:", err));
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) {
			const meta = user.user_metadata || {};
			setFullName(meta["full_name"] || meta["name"] || "");
			setAvatarUrl(meta["avatar_url"] || meta["picture"] || "");
			setHomeCity(meta["home_city"] || "Mumbai");
			setCurrency(meta["currency"] || "INR");
		} else try {
			const guestPref = localStorage.getItem("smarttrip.guest_profile");
			if (guestPref) {
				const parsed = JSON.parse(guestPref);
				if (parsed.fullName) setFullName(parsed.fullName);
				if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
				if (parsed.homeCity) setHomeCity(parsed.homeCity);
				if (parsed.currency) setCurrency(parsed.currency);
			}
		} catch {}
	}, [user]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (user) {
				const res = await updateProfile({
					fullName,
					avatarUrl,
					homeCity,
					currency
				});
				if (res.error) {
					toast.error(res.error);
					setSaving(false);
					return;
				}
				try {
					await updateProfileFn({ data: {
						fullName,
						avatarUrl,
						homeCity,
						currency
					} });
				} catch (serverErr) {
					console.warn("Could not sync to profiles table:", serverErr);
				}
				toast.success("Settings saved successfully!");
			} else {
				localStorage.setItem("smarttrip.guest_profile", JSON.stringify({
					fullName,
					avatarUrl,
					homeCity,
					currency
				}));
				toast.success("Preferences saved locally!");
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to save settings";
			toast.error(msg);
		} finally {
			setSaving(false);
		}
	};
	const userInitial = fullName.trim().length > 0 ? fullName.trim()[0]?.toUpperCase() : user?.email?.[0]?.toUpperCase() ?? "T";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Account & Preferences",
			subtitle: "Customize your traveler profile, choose your home departure city, and set your default currency for travel budgets."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container-page py-10 max-w-4xl",
			children: [!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 rounded-3xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: "Browsing as a Guest"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Sign in or create a free account to sync your profile, bookings, and trip fund across all your devices."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						className: "rounded-xl flex-1 sm:flex-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { redirect: "/settings" },
							children: "Sign In"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "sm",
						asChild: true,
						className: "rounded-xl flex-1 sm:flex-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							search: { redirect: "/settings" },
							children: "Sign Up"
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-panel rounded-3xl p-6 sm:p-8 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-center gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative group shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "size-24 rounded-3xl ring-4 ring-primary/10 shadow-elevated",
									children: [avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: avatarUrl,
										alt: fullName || "User Avatar"
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-2xl font-bold bg-gradient-brand text-primary-foreground",
										children: userInitial
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center sm:text-left space-y-1.5 flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-center sm:justify-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xl font-bold text-foreground",
											children: fullName.trim() || (user ? "Adventurous Traveler" : "Guest Explorer")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-primary",
											children: user ? "Active Traveler" : "Guest Mode"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: user ? user.email : "Local session on this browser"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 text-primary shrink-0" }),
											"Home base: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: homeCity
											}),
											" · Currency:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: currency
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/50 pt-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5 text-primary" }), "Avatar Picture"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "url",
										placeholder: "Paste an image URL (e.g. https://...)",
										value: avatarUrl,
										onChange: (e) => setAvatarUrl(e.target.value),
										className: "rounded-xl h-10 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Paste a direct link to your photo, or choose one of the curated traveler avatars below."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted-foreground mb-2.5",
								children: "Curated Traveler Avatars:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 sm:grid-cols-6 gap-3",
								children: PRESET_AVATARS.map((preset) => {
									const isSelected = avatarUrl === preset.url;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setAvatarUrl(preset.url),
										className: `group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${isSelected ? "border-primary bg-primary/10 shadow-soft" : "border-border/60 hover:border-border hover:bg-secondary/40"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: preset.url,
												alt: preset.label,
												loading: "lazy",
												decoding: "async",
												width: 48,
												height: 48,
												className: "size-12 rounded-xl object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-medium text-foreground text-center truncate max-w-full leading-tight",
												children: preset.label
											}),
											isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-2.5" })
											})
										]
									}, preset.label);
								})
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-panel rounded-3xl p-6 sm:p-8 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-base text-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }), "Traveler Information"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-foreground",
										children: "Full Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										placeholder: "e.g. Aayush Chaudhari",
										value: fullName,
										onChange: (e) => setFullName(e.target.value),
										className: "rounded-xl h-10 text-sm",
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-foreground",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: user?.email || "guest@smarttrip.local",
										disabled: true,
										className: "rounded-xl h-10 text-sm opacity-60 cursor-not-allowed bg-muted/40"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/50 pt-6 space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-base text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4 text-primary" }), "Regional & Travel Preferences"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), "Home Departure City"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												placeholder: "e.g. Mumbai",
												value: homeCity,
												onChange: (e) => setHomeCity(e.target.value),
												className: "rounded-xl h-10 text-sm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground block",
													children: "Quick select popular hubs:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap gap-1.5",
													children: POPULAR_CITIES.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setHomeCity(city),
														className: `text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${homeCity.toLowerCase() === city.toLowerCase() ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground/80 hover:bg-secondary/80"}`,
														children: city
													}, city))
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5 text-primary" }), "Preferred Currency"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: currency,
												onValueChange: setCurrency,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl h-10 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select currency" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "rounded-2xl",
													children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: c.code,
														className: "cursor-pointer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-primary mr-1.5",
															children: c.symbol
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
															c.name,
															" (",
															c.code,
															")"
														] })]
													}, c.code))
												})]
											}),
											currency === "INR" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-secondary/50 p-2.5 text-[11px] text-muted-foreground flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Base currency: Indian Rupee (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: "1 INR = ₹1.00"
												})]
											}) : ratesData?.rates[currency] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "Live ECB Rate via Frankfurter:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-bold",
														children: [
															"1 INR = ",
															ratesData.rates[currency],
															" ",
															currency
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: [
														"Sample: ₹10,000 = ",
														(1e4 * ratesData.rates[currency]).toFixed(2),
														" ",
														currency,
														". Rates cached daily."
													]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center gap-1.5 font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unsupported by ECB rates" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px]",
													children: [currency, " is not tracked by the European Central Bank. Showing in INR only (₹)."]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: "All budget estimations and trip calculations will be presented in your preferred currency."
											})
										]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "rounded-xl",
							onClick: () => navigate({ to: "/my-trips" }),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "hero",
							disabled: saving,
							className: "rounded-xl min-w-36 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), saving ? "Saving..." : "Save Changes"]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { SettingsPage as component };
