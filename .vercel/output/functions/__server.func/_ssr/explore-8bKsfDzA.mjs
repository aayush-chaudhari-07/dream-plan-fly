import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { f as Navbar, u as Footer } from "./Navbar-G5xs2vbg.mjs";
import { t as SupportDock } from "./SupportDock-BQEj3o76.mjs";
import { t as PageHeader } from "./PageHeader-CiBUEnzv.mjs";
import { t as ExploreDestinations } from "./ExploreDestinations-B8ceVSzX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-8bKsfDzA.js
var import_jsx_runtime = require_jsx_runtime();
function ExplorePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Explore Destinations",
			subtitle: "Curated places with honest descriptions, real prices and ratings. Find your next adventure."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExploreDestinations, { grid: true }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportDock, {})
	] });
}
//#endregion
export { ExplorePage as component };
