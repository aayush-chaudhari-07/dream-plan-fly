import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BSij73O2.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ft as CircleAlert, Tt as Compass, Z as Mail, et as Lock, tn as ArrowRight, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-context-BwjyU4uq.mjs";
import { d as Input, f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as Route } from "./login-CErOULlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CQO4JKBR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { redirect: redirectUrl } = Route.useSearch();
	const { signInWithPassword, signInWithGoogle, user, isConfigured } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [googleSubmitting, setGoogleSubmitting] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: redirectUrl || "/my-trips" });
	}, [
		user,
		redirectUrl,
		navigate
	]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			setErrorMsg("Please enter both email and password.");
			return;
		}
		setErrorMsg(null);
		setSubmitting(true);
		try {
			const res = await signInWithPassword({
				email,
				password
			});
			if (res.error) {
				setErrorMsg(res.error);
				toast.error("Failed to sign in", { description: res.error });
			} else {
				toast.success("Welcome back!", { description: "You are now signed in." });
				navigate({ to: redirectUrl || "/my-trips" });
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
			setErrorMsg(msg);
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};
	const handleGoogleSignIn = async () => {
		setErrorMsg(null);
		setGoogleSubmitting(true);
		try {
			const res = await signInWithGoogle();
			if (res.error) {
				setErrorMsg(res.error);
				toast.error("Google sign-in error", { description: res.error });
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to connect to Google.";
			setErrorMsg(msg);
		} finally {
			setGoogleSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page flex flex-1 items-center justify-center py-24 sm:py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-elevated",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-primary",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative text-center mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-soft mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
										children: "Welcome back"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "Sign in to sync your trips, bookings, and dream funds."
									})
								]
							}),
							!isConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Backend in Local Mode:"
									}), " Supabase environment variables are not configured. You can continue as a guest with localStorage."] })]
								})
							}),
							errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive",
								children: errorMsg
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "lg",
								className: "w-full rounded-2xl h-11 text-sm font-semibold border-border/80 hover:bg-secondary flex items-center justify-center gap-2",
								onClick: handleGoogleSignIn,
								disabled: googleSubmitting || submitting,
								children: [googleSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "size-4",
									viewBox: "0 0 24 24",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											fill: "#4285F4",
											d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											fill: "#34A853",
											d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											fill: "#FBBC05",
											d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											fill: "#EA4335",
											d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
										})
									]
								}), "Continue with Google"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative my-5 text-center text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border/60" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative bg-card px-2",
									children: "or with email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-foreground/80 mb-1.5",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											placeholder: "you@example.com",
											required: true,
											className: "pl-10 h-11 rounded-xl bg-background/50 border-border/80"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between mb-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-foreground/80",
											children: "Password"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "••••••••",
											required: true,
											className: "pl-10 h-11 rounded-xl bg-background/50 border-border/80"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										variant: "hero",
										size: "lg",
										className: "w-full rounded-2xl h-11 text-sm font-semibold shadow-soft",
										disabled: submitting,
										children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }), "Signing in..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Sign In", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 ml-1.5" })] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 text-center text-xs text-muted-foreground space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Don't have an account?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/signup",
										search: { redirect: redirectUrl },
										className: "font-semibold text-primary hover:underline",
										children: "Create one now"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: redirectUrl || "/",
									className: "text-muted-foreground hover:text-foreground transition-colors",
									children: "← Continue as guest"
								}) })]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LoginPage as component };
