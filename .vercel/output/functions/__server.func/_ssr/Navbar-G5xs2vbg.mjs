import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-BSij73O2.mjs";
import { r as destinations } from "./travel-Co-Z1Moz.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useSmartTrip, p as subscribeNewsletterFn, u as smartTrip } from "./smarttrip-store-B4h7bmlO.mjs";
import { $ as LogOut, A as Settings, Bt as CheckCheck, J as Menu, Lt as ChevronRight, M as Search, Q as Luggage, Tt as Compass, V as Plane, Zt as Bell, d as Trophy, dt as History, ft as Heart, h as Ticket, jt as Circle, m as Trash2, n as Youtube, nt as Linkedin, o as Wallet, p as TrendingDown, r as X, st as Instagram, tn as ArrowRight, tt as LoaderCircle, x as Sparkles, zt as Check } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-context-BwjyU4uq.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Navbar-G5xs2vbg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var columns = [
	{
		title: "Explore",
		items: [
			{
				label: "Destinations",
				href: "/#destinations"
			},
			{
				label: "Hotels",
				href: "/bookings"
			},
			{
				label: "Flights",
				href: "/bookings"
			},
			{
				label: "Interactive Map",
				href: "/#map"
			}
		]
	},
	{
		title: "Plan",
		items: [
			{
				label: "AI Trip Planner",
				href: "/ai-planner"
			},
			{
				label: "My Trips",
				href: "/my-trips"
			},
			{
				label: "Wishlist",
				href: "/#destinations"
			},
			{
				label: "Trip Fund",
				href: "/save"
			}
		]
	},
	{
		title: "Support & Legal",
		items: [
			{
				label: "Help Center & FAQ",
				href: "/faq"
			},
			{
				label: "Terms & Disclaimers",
				href: "/terms"
			},
			{
				label: "Privacy Policy",
				href: "/privacy"
			},
			{
				label: "Safety Guide",
				href: "/#guide"
			}
		]
	}
];
function Footer() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const handleSubscribe = async (e) => {
		e.preventDefault();
		const trimmed = email.trim();
		if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
			toast.error("Please enter a valid email address");
			return;
		}
		setIsSubmitting(true);
		try {
			const res = await subscribeNewsletterFn({ data: { email: trimmed } });
			if (res.status === "already_subscribed") toast.info(res.message);
			else {
				toast.success(res.message);
				setEmail("");
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to subscribe. Please try again.";
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-brand flex size-10 items-center justify-center rounded-2xl text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-lg font-bold",
							children: "SmartTrip"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: "Travel smarter. Explore more."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-sm text-muted-foreground",
						children: "Dream it, ask AI, plan it, save for it, book it — and actually enjoy the journey."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex gap-2",
						children: [
							Instagram,
							Youtube,
							Linkedin
						].map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							size: "icon",
							className: "rounded-full",
							"aria-label": "Follow SmartTrip",
							onClick: () => toast("Thanks for following SmartTrip!"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {})
						}, i))
					})
				]
			}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-foreground",
				children: col.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2.5",
				children: col.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.href,
					className: "text-sm text-muted-foreground transition-colors hover:text-primary",
					children: item.label
				}) }, item.label))
			})] }, col.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page border-t border-border py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				onSubmit: handleSubscribe,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-base font-semibold",
					children: "Get travel inspiration in your inbox."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "One thoughtful email a week. No spam."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-md gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						disabled: isSubmitting,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@example.com",
						className: "h-11 rounded-xl",
						"aria-label": "Email address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "hero",
						size: "lg",
						disabled: isSubmitting,
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-1" }), "Subscribing…"] }) : "Subscribe"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" SmartTrip. All booking engines and fares operate in demo simulation mode."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							className: "hover:text-primary transition-colors",
							children: "Terms & Disclaimers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "hover:text-primary transition-colors",
							children: "Privacy Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/save",
							className: "hover:text-primary transition-colors",
							children: "Start Trip Fund"
						})
					]
				})]
			})]
		})]
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-offset-background", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full object-cover", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-secondary font-medium text-foreground", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command$1, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var RECENT_KEY = "smarttrip.recent_searches";
function SearchCommandDialog({ open, onOpenChange }) {
	const navigate = useNavigate();
	const { trips, bookings } = useSmartTrip();
	const [recentSearches, setRecentSearches] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const onKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
				e.preventDefault();
				onOpenChange(!open);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (open) try {
			const raw = localStorage.getItem(RECENT_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, 5));
			}
		} catch {}
	}, [open]);
	const addRecent = (term) => {
		const trimmed = term.trim();
		if (!trimmed) return;
		const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
		setRecentSearches(updated);
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
		} catch {}
	};
	const removeRecent = (term, e) => {
		e.stopPropagation();
		const updated = recentSearches.filter((s) => s !== term);
		setRecentSearches(updated);
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
		} catch {}
	};
	const clearAllRecent = (e) => {
		e.stopPropagation();
		setRecentSearches([]);
		try {
			localStorage.removeItem(RECENT_KEY);
		} catch {}
	};
	const handleSelect = (callback, term) => {
		if (term) addRecent(term);
		onOpenChange(false);
		callback();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandDialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
			placeholder: "Search destinations, trips, bookings or quick links...",
			value: search,
			onValueChange: setSearch,
			"data-testid": "search-input"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, {
			className: "max-h-[380px] p-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, {
					className: "py-8 text-center text-sm text-muted-foreground",
					children: "No matching destinations, trips, or bookings found."
				}),
				recentSearches.length > 0 && !search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pr-2 text-xs font-semibold text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5" }), " Recent Searches"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: clearAllRecent,
							className: "text-[11px] text-muted-foreground hover:text-foreground cursor-pointer",
							children: "Clear all"
						})]
					}),
					children: recentSearches.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						value: `recent-${term}`,
						onSelect: () => {
							setSearch(term);
						},
						className: "flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: term })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: (e) => removeRecent(term, e),
							className: "rounded-full p-1 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10",
							"aria-label": `Remove ${term}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
						})]
					}, term))
				}),
				recentSearches.length > 0 && !search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, { className: "my-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Destinations",
					children: destinations.map((dest) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						value: `${dest.name} ${dest.region} ${dest.category} destination`,
						onSelect: () => handleSelect(() => {
							navigate({
								to: "/destination/$id",
								params: { id: dest.id }
							});
						}, dest.name),
						className: "flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: dest.image,
								alt: dest.name,
								loading: "lazy",
								decoding: "async",
								width: 32,
								height: 32,
								className: "size-8 rounded-lg object-cover shrink-0 shadow-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground leading-tight truncate",
									children: dest.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: dest.region
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-xs font-semibold text-primary",
							children: ["₹", dest.price.toLocaleString("en-IN")]
						})]
					}, dest.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, { className: "my-1" }),
				trips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "My Saved & Upcoming Trips",
					children: trips.slice(0, 6).map((trip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						value: `${trip.name} ${trip.dates} ${trip.bucket} trip`,
						onSelect: () => handleSelect(() => {
							navigate({ to: "/my-trips" });
						}, trip.name),
						className: "flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground leading-tight truncate",
									children: trip.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: trip.dates
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full",
							children: trip.bucket
						})]
					}, trip.id))
				}),
				bookings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Bookings",
					children: bookings.slice(0, 5).map((booking) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						value: `${booking.title} ${booking.subtitle} ${booking.reference} booking`,
						onSelect: () => handleSelect(() => {
							navigate({ to: "/bookings" });
						}, booking.title),
						className: "flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "size-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground leading-tight truncate",
									children: booking.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: [
										"Ref: ",
										booking.reference,
										" · ",
										booking.subtitle
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-xs font-semibold text-foreground",
							children: ["₹", booking.price.toLocaleString("en-IN")]
						})]
					}, booking.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, { className: "my-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
					heading: "Quick Actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "AI Trip Planner create plan custom itinerary",
							onSelect: () => handleSelect(() => {
								navigate({ to: "/ai-planner" });
							}),
							className: "rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Trip Planner" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "Explore around you interactive map destinations",
							onSelect: () => handleSelect(() => {
								navigate({ to: "/explore" });
							}),
							className: "rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Destinations & Map" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "Bookings flights stays rentals packages",
							onSelect: () => handleSelect(() => {
								navigate({ to: "/bookings" });
							}),
							className: "rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search & Manage Bookings" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "Trip Fund dream vacation savings goals",
							onSelect: () => handleSelect(() => {
								navigate({ to: "/save" });
							}),
							className: "rounded-xl px-3 py-2 text-sm cursor-pointer flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dream Trip Fund" })]
						})
					]
				})
			]
		})]
	});
}
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
function WishlistSheet({ open, onOpenChange }) {
	const { wishlist } = useSmartTrip();
	const navigate = useNavigate();
	const wishlistedItems = destinations.filter((d) => wishlist.includes(d.id));
	const handleRemove = (id, name) => {
		smartTrip.toggleWish(id);
		toast.success(`Removed ${name} from your wishlist`);
	};
	const handlePlanTrip = (name) => {
		onOpenChange(false);
		navigate({
			to: "/ai-planner",
			search: { q: `Plan a trip to ${name}` }
		});
	};
	const totalEstimated = wishlistedItems.reduce((acc, curr) => acc + curr.price, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			"data-testid": "wishlist-sheet",
			className: "w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
					className: "p-6 pb-4 border-b border-border/50 text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5 fill-rose-500" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "text-lg font-bold text-foreground",
								children: "Wishlist"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
								className: "text-xs text-muted-foreground",
								children: [
									wishlistedItems.length,
									" ",
									wishlistedItems.length === 1 ? "destination saved" : "destinations saved"
								]
							})] })]
						}), wishlistedItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-foreground",
							children: ["Est. ₹", totalEstimated.toLocaleString("en-IN")]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6 space-y-4",
					children: wishlistedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center text-center py-16 px-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground/60 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-8" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-foreground text-base",
									children: "Your wishlist is empty"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-xs leading-relaxed",
									children: "Discover breathtaking destinations across India and beyond, and tap the heart icon to save them here for later."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "rounded-full gap-2 text-xs font-semibold mt-2",
								asChild: true,
								onClick: () => onOpenChange(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/explore",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5" }), "Explore Destinations"]
								})
							})
						]
					}) : wishlistedItems.map((dest) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex gap-3.5 p-3 rounded-2xl border border-border/60 bg-card/60 hover:bg-card hover:shadow-soft transition-all duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/destination/$id",
							params: { id: dest.id },
							onClick: () => onOpenChange(false),
							className: "shrink-0 overflow-hidden rounded-xl size-20 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: dest.image,
								alt: dest.name,
								loading: "lazy",
								decoding: "async",
								width: 80,
								height: 80,
								className: "size-full object-cover group-hover:scale-105 transition-transform duration-300"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/destination/$id",
									params: { id: dest.id },
									onClick: () => onOpenChange(false),
									className: "cursor-pointer group-hover:text-primary transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm text-foreground truncate leading-tight",
										children: dest.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: dest.region
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleRemove(dest.id, dest.name),
									className: "text-muted-foreground/50 hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors",
									title: "Remove from wishlist",
									"aria-label": `Remove ${dest.name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground block leading-none",
									children: "Est. from"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground",
									children: ["₹", dest.price.toLocaleString("en-IN")]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "sm",
									onClick: () => handlePlanTrip(dest.name),
									className: "h-7 text-[11px] rounded-lg px-2.5 gap-1.5 font-medium shadow-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), "Plan Trip"]
								})]
							})]
						})]
					}, dest.id))
				}),
				wishlistedItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-border/50 bg-secondary/30 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						className: "flex-1 rounded-xl text-xs",
						onClick: () => onOpenChange(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/explore",
							children: ["Explore More", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3 ml-1" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "sm",
						className: "flex-1 rounded-xl text-xs gap-1.5",
						onClick: () => {
							onOpenChange(false);
							navigate({ to: "/ai-planner" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "AI Itinerary"]
					})]
				})
			]
		})
	});
}
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverContent$1.displayName;
function getNotificationIcon(type) {
	switch (type) {
		case "booking": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-4 text-emerald-600" });
		case "milestone": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-amber-500" });
		case "price_drop": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4 text-sky-500" });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" });
	}
}
function getNotificationBadgeClass(type) {
	switch (type) {
		case "booking": return "bg-emerald-500/10 text-emerald-600";
		case "milestone": return "bg-amber-500/10 text-amber-600";
		case "price_drop": return "bg-sky-500/10 text-sky-600";
		default: return "bg-primary/10 text-primary";
	}
}
function formatRelativeTime(timestamp) {
	const diff = Date.now() - timestamp;
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
function NotificationsPopover({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { notifications } = useSmartTrip();
	const navigate = useNavigate();
	const unreadCount = notifications.filter((n) => !n.read).length;
	const handleMarkAllRead = (e) => {
		e.stopPropagation();
		smartTrip.markAllNotificationsRead();
		toast.success("All notifications marked as read");
	};
	const handleNotificationClick = (n) => {
		if (!n.read) smartTrip.markNotificationRead(n.id);
		if (n.link) {
			setOpen(false);
			navigate({ href: n.link });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: children ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Notifications",
				className: "relative rounded-full text-foreground/70 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute top-1.5 right-1.5 flex size-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-rose-500" })]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			sideOffset: 8,
			className: "w-84 sm:w-96 rounded-2xl p-0 shadow-elevated border-border/70 overflow-hidden bg-card/95 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-4 pb-3 border-b border-border/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold text-sm text-foreground",
						children: "Notifications"
					}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary",
						children: [unreadCount, " new"]
					})]
				}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleMarkAllRead,
					className: "text-xs text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3.5" }), "Mark all read"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-y-auto divide-y divide-border/30",
				children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "You are all caught up!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No new trip milestones, bookings, or price drop alerts."
						})
					]
				}) : notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => handleNotificationClick(n),
					className: cn("p-3.5 transition-colors cursor-pointer flex gap-3 items-start hover:bg-secondary/60", !n.read && "bg-primary/5"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex size-8 shrink-0 items-center justify-center rounded-xl", getNotificationBadgeClass(n.type)),
							children: getNotificationIcon(n.type)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-xs font-semibold truncate leading-tight", !n.read ? "text-foreground font-bold" : "text-foreground/80"),
									children: n.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] text-muted-foreground",
									children: formatRelativeTime(n.createdAt)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground line-clamp-2 leading-relaxed",
								children: n.message
							})]
						}),
						!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 size-2 rounded-full bg-primary shrink-0",
							"aria-label": "Unread"
						})
					]
				}, n.id))
			})]
		})]
	});
}
var links = [
	{
		label: "Home",
		to: "/"
	},
	{
		label: "Explore",
		to: "/explore"
	},
	{
		label: "AI Trip Planner",
		to: "/ai-planner"
	},
	{
		label: "Bookings",
		to: "/bookings"
	},
	{
		label: "My Trips",
		to: "/my-trips"
	},
	{
		label: "Save & Dream",
		to: "/save"
	}
];
function Navbar() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [wishlistOpen, setWishlistOpen] = (0, import_react.useState)(false);
	const { user, signOut } = useAuth();
	const { wishlist, notifications } = useSmartTrip();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const handleSignOut = async () => {
		await signOut();
		toast.success("Signed out successfully");
		navigate({ to: "/" });
	};
	const userMeta = user?.user_metadata || {};
	const userName = userMeta["full_name"] || userMeta["name"] || "Traveler";
	const userAvatar = userMeta["avatar_url"] || userMeta["picture"] || "";
	const userInitial = userName.trim().length > 0 ? userName.trim()[0]?.toUpperCase() : user?.email?.[0]?.toUpperCase() ?? "T";
	notifications.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-card/70 shadow-soft backdrop-blur-xl backdrop-saturate-150" : "bg-transparent"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "container-page flex h-18 items-center justify-between gap-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5 shrink-0",
						onClick: () => setOpen(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-brand flex size-10 items-center justify-center rounded-2xl text-primary-foreground shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "leading-tight hidden sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-lg font-bold text-foreground",
								children: "SmartTrip"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-muted-foreground",
								children: "Travel smarter. Explore more."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden items-center gap-1 xl:flex",
						children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							activeOptions: { exact: link.to === "/" },
							activeProps: { className: "bg-secondary text-primary" },
							className: "rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary",
							children: link.label
						}, link.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSearchOpen(true),
								className: "hidden md:inline-flex items-center gap-2 rounded-full bg-secondary/40 hover:bg-secondary border-border/50 text-xs text-muted-foreground hover:text-foreground px-3.5 h-9",
								"aria-label": "Search destinations and trips",
								"data-testid": "search-button",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search destinations..." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "pointer-events-none hidden lg:inline-flex h-4 select-none items-center gap-0.5 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground border border-border/60",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Search",
								onClick: () => setSearchOpen(true),
								className: "rounded-full text-foreground/70 md:hidden",
								"data-testid": "search-button-mobile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Wishlist",
								className: "relative rounded-full text-foreground/70 hover:text-foreground",
								onClick: () => setWishlistOpen(true),
								"data-testid": "wishlist-button",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4" }), wishlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm",
									children: wishlist.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPopover, {}),
							user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer",
									"aria-label": "User Account Menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "size-9 ring-2 ring-primary/20 transition-all hover:ring-primary/40 shadow-soft",
										children: [userAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
											src: userAvatar,
											alt: userName
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "font-semibold text-xs bg-gradient-brand text-primary-foreground",
											children: userInitial
										})]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-60 rounded-2xl p-2 shadow-elevated bg-card/95 backdrop-blur-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
										className: "font-normal px-2.5 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
												className: "size-9 shrink-0",
												children: [userAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
													src: userAvatar,
													alt: userName
												}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
													className: "font-bold text-xs bg-gradient-brand text-primary-foreground",
													children: userInitial
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold text-foreground truncate",
													children: userName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground truncate",
													children: user.email
												})]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										className: "rounded-xl cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/my-trips",
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Trips & Bookings" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										className: "rounded-xl cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/save",
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trip Funds" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										className: "rounded-xl cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/settings",
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settings & Profile" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: handleSignOut,
										className: "rounded-xl cursor-pointer text-destructive focus:text-destructive flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
									})
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									asChild: true,
									className: "rounded-full text-xs font-semibold px-3 h-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										search: { redirect: void 0 },
										children: "Sign In"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "hero",
									size: "sm",
									asChild: true,
									className: "rounded-full text-xs font-semibold px-3.5 h-8 shadow-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/signup",
										search: { redirect: void 0 },
										children: "Sign Up"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "hero",
								size: "pill",
								asChild: true,
								className: "hidden md:inline-flex h-9 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/ai-planner",
									children: "Plan My Trip"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "rounded-full xl:hidden",
								"aria-label": "Toggle Navigation Menu",
								onClick: () => setOpen((v) => !v),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							})
						]
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-panel container-page mb-3 rounded-3xl p-4 xl:hidden shadow-elevated animate-in fade-in-0 slide-in-from-top-2 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							setOpen(false);
							setSearchOpen(true);
						},
						className: "w-full justify-between rounded-2xl text-muted-foreground h-11 px-4 mb-3 bg-secondary/40 border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: "Search destinations, trips, bookings..."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded bg-background px-1.5 py-0.5 text-[10px] font-mono border border-border/60",
							children: "⌘K"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setOpen(false);
								setWishlistOpen(true);
							},
							className: "flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5 text-rose-500 fill-rose-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wishlist" }),
								wishlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white",
									children: wishlist.length
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/settings",
							onClick: () => setOpen(false),
							className: "flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settings" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [
							links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: link.to,
								onClick: () => setOpen(false),
								className: "rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: link.label }), link.to === "/ai-planner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-amber-500" })]
							}, link.to)),
							user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/50 pt-3 mt-2 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 px-3 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "size-9",
										children: [userAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
											src: userAvatar,
											alt: userName
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "font-semibold text-xs bg-gradient-brand text-primary-foreground",
											children: userInitial
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground truncate",
											children: userName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground truncate",
											children: user.email
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setOpen(false);
										handleSignOut();
									},
									className: "w-full justify-start rounded-xl text-destructive hover:text-destructive h-9",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 mr-2" }), "Sign Out"]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/50 pt-3 mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									asChild: true,
									className: "flex-1 rounded-xl h-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										search: { redirect: void 0 },
										onClick: () => setOpen(false),
										children: "Sign In"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "hero",
									size: "sm",
									asChild: true,
									className: "flex-1 rounded-xl h-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/signup",
										search: { redirect: void 0 },
										onClick: () => setOpen(false),
										children: "Sign Up"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "hero",
								size: "lg",
								asChild: true,
								className: "mt-3 rounded-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/ai-planner",
									onClick: () => setOpen(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 mr-2" }), "Plan My Trip"]
								})
							})
						]
					})
				]
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCommandDialog, {
			open: searchOpen,
			onOpenChange: setSearchOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistSheet, {
			open: wishlistOpen,
			onOpenChange: setWishlistOpen
		})
	] });
}
//#endregion
export { DialogContent as a, DialogHeader as c, Input as d, Navbar as f, Dialog as i, DialogTitle as l, AvatarFallback as n, DialogDescription as o, AvatarImage as r, DialogFooter as s, Avatar as t, Footer as u };
