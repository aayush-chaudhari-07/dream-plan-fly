import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-BSij73O2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-YnFTFRXl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useInView(threshold = .15) {
	const ref = (0, import_react.useRef)(null);
	const [inView, setInView] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			});
		}, {
			threshold,
			rootMargin: "0px 0px -60px 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return {
		ref,
		inView
	};
}
function Reveal({ children, className, delay = 0 }) {
	const { ref, inView } = useInView();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: { transitionDelay: `${delay}ms` },
		className: cn("reveal", inView && "is-visible", className),
		children
	});
}
function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
		className: cn("max-w-2xl", align === "center" && "mx-auto text-center"),
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase",
				children: eyebrow
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-3xl leading-tight font-bold text-foreground sm:text-4xl",
				children: title
			}),
			subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base text-muted-foreground",
				children: subtitle
			}) : null
		]
	});
}
//#endregion
export { SectionHeading as n, Reveal as t };
