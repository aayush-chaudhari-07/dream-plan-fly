import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-context-BwjyU4uq.mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { t as TripFund } from "./TripFund-B9rACDh3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/save-CfCk7pOo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavePage() {
	const { user, isLoading: authLoading, isConfigured } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (isConfigured && !authLoading && !user) navigate({
			to: "/login",
			search: { redirect: "/save" }
		});
	}, [
		isConfigured,
		authLoading,
		user,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Save for Your Future Trip",
			subtitle: "Dream bigger. Save smarter. SmartTrip helps you track progress, set monthly goals and stay motivated until takeoff."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripFund, {}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { SavePage as component };
