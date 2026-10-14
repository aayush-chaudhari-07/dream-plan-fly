import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { t as AiPlanner } from "./AiPlanner-CPnWLPlk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-planner-DZWFypHr.js
var import_jsx_runtime = require_jsx_runtime();
function AiPlannerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "AI Trip Planner",
			subtitle: "Describe your dream trip — destination, budget, travelers, dates — and SmartTrip AI will craft a complete itinerary in seconds."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPlanner, {}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { AiPlannerPage as component };
