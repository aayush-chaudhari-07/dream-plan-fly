import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as getSupabaseBrowserClient } from "./client-Hc8aN5M7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-CjDx79Qt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallbackPage() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		getSupabaseBrowserClient().auth.getSession().then(() => {
			navigate({ to: "/my-trips" });
		});
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: "Completing authentication and syncing your trips..."
			})]
		})
	});
}
//#endregion
export { AuthCallbackPage as component };
