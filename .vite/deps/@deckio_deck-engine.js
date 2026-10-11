import { i as __toESM } from "./rolldown-runtime-B-lAHAz2.js";
import { t as require_react } from "./react.js";
import { t as require_react_dom } from "./react-dom.js";
import { t as require_jsx_runtime } from "./react_jsx-runtime.js";
import { n as useOrderedItems, r as InlineEditContext, t as EditableList } from "./EditableList-BHAKbQmq.js";
import styles from "C:/Users/t-nathanb/.copilot/repos/copilot-worktrees/agentic-ai-apps-winter-bootcamp/natethebuilder-effective-fortnight/node_modules/@deckio/deck-engine/components/Navigation.module.css";
import styles$1 from "C:/Users/t-nathanb/.copilot/repos/copilot-worktrees/agentic-ai-apps-winter-bootcamp/natethebuilder-effective-fortnight/node_modules/@deckio/deck-engine/components/BottomBar.module.css";
//#region node_modules/@deckio/deck-engine/context/nav-utils.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* nav-utils — pure, side-effect-free navigation math for SlideProvider.
*
* Extracted so the present/edit-mode + hidden-slide navigation rules can be
* unit-tested in a plain Node environment (no DOM, no React) and stay
* deterministic. SlideContext.jsx is a thin React wrapper over these.
*/
/**
* Normalize a hiddenSlides array (authored in deck.config.js) into a sorted,
* de-duplicated list of in-range integer indices.
*/
function normalizeHidden(arr, total) {
	if (!Array.isArray(arr)) return [];
	const set = /* @__PURE__ */ new Set();
	for (const v of arr) if (Number.isInteger(v) && v >= 0 && v < total) set.add(v);
	return [...set].sort((a, b) => a - b);
}
/**
* Absolute slide indices reachable in the given mode. Present mode drops
* hidden slides; any other mode (edit) keeps every slide.
*/
function computeVisibleIndices(totalSlides, hiddenSet, mode) {
	const out = [];
	for (let i = 0; i < totalSlides; i++) if (mode !== "present" || !hiddenSet.has(i)) out.push(i);
	return out;
}
/**
* Resolve a relative step (dir = +1 / -1) from `prev`.
*   - edit (non-present): simple clamp over [0, totalSlides).
*   - present: walk visibleIndices; if `prev` is hidden, jump to the nearest
*     visible slide in the travel direction.
* Returns the next absolute index (or `prev` if the move is not possible).
*/
function stepVisible(prev, dir, visibleIndices, mode, totalSlides) {
	if (mode !== "present") {
		const next = prev + dir;
		return next < 0 || next >= totalSlides ? prev : next;
	}
	if (visibleIndices.length === 0) return prev;
	const pos = visibleIndices.indexOf(prev);
	if (pos === -1) {
		if (dir > 0) {
			const fwd = visibleIndices.find((i) => i > prev);
			return fwd != null ? fwd : prev;
		}
		const back = [...visibleIndices].reverse().find((i) => i < prev);
		return back != null ? back : prev;
	}
	const nextPos = pos + dir;
	if (nextPos < 0 || nextPos >= visibleIndices.length) return prev;
	return visibleIndices[nextPos];
}
/**
* Resolve an absolute goTo target.
*   - Out-of-range → null (caller ignores).
*   - present mode + hidden target → nearest visible slide (forward first,
*     else the last visible slide).
*   - otherwise → the requested index.
*/
function resolveGoTo(idx, mode, hiddenSet, visibleIndices, totalSlides) {
	if (!Number.isInteger(idx) || idx < 0 || idx >= totalSlides) return null;
	if (mode === "present" && hiddenSet.has(idx)) {
		const fwd = visibleIndices.find((i) => i >= idx);
		if (fwd != null) return fwd;
		return visibleIndices.length ? visibleIndices[visibleIndices.length - 1] : null;
	}
	return idx;
}
/**
* If `current` lands on a hidden slide while in present mode, return the
* visible slide it should snap to (forward first, else last visible). Returns
* null when no snap is needed (or not possible).
*/
function snapToVisible(current, mode, hiddenSet, visibleIndices, totalSlides) {
	if (mode !== "present" || totalSlides === 0) return null;
	if (!visibleIndices.length || !hiddenSet.has(current)) return null;
	const fwd = visibleIndices.find((i) => i >= current);
	return fwd != null ? fwd : visibleIndices[visibleIndices.length - 1];
}
/**
* Present-aware display metrics for Navigation / progress UI.
*/
function displayMetrics(current, visibleIndices, mode, totalSlides) {
	const displayIndex = mode === "present" ? Math.max(0, visibleIndices.indexOf(current)) : current;
	const visibleCount = visibleIndices.length || (mode === "present" ? 0 : totalSlides);
	return {
		displayIndex,
		visibleCount,
		progress: visibleCount > 0 ? (displayIndex + 1) / visibleCount * 100 : 0,
		atStart: displayIndex <= 0,
		atEnd: displayIndex >= visibleCount - 1,
		firstVisibleIndex: visibleIndices[0] ?? 0
	};
}
/**
* Resolve the *effective* navigation mode. Browser fullscreen forces present
* behaviour (hidden slides skipped, edit affordances gone) regardless of the
* authored/active mode, so a standalone deck shown fullscreen never reveals
* slides the author hid. Outside fullscreen the active mode wins unchanged.
*/
function resolveEffectiveMode(activeMode, isFullscreen) {
	return isFullscreen ? "present" : activeMode;
}
/**
* Decide the initial edit/present mode from URL params + an explicit prop.
* `search` is a location.search string; `isDev` is import.meta.env.DEV.
*/
function resolveInitialMode$1(search, modeProp, isDev) {
	try {
		const params = new URLSearchParams(search || "");
		if (params.get("present") === "1") return "present";
		if (params.get("edit") === "1") return "edit";
	} catch {}
	if (modeProp === "edit" || modeProp === "present") return modeProp;
	return isDev ? "edit" : "present";
}
//#endregion
//#region node_modules/@deckio/deck-engine/context/export-state.js
/**
* Export-state signal.
*
* While a PDF/PPTX capture is running the engine sets
* `data-export-mode="capture"` on <html> (see exportDeckService.withExportMode).
* Slides that gate content behind progressive disclosure (or any other
* "reveal over time" interaction) can subscribe to this signal and render
* their fully-revealed state during capture so the exported image matches the
* slide's final state instead of its initial one.
*/
var EXPORT_ATTR = "data-export-mode";
var CAPTURE = "capture";
function isExportingNow() {
	return typeof document !== "undefined" && document.documentElement.getAttribute(EXPORT_ATTR) === CAPTURE;
}
/**
* React hook returning `true` while the deck is being captured for export.
*
*   const exporting = useIsExporting()
*   const visible = exporting ? steps.length : visibleCount
*
* Reveal everything during export so progressive-disclosure slides export
* their final state.
*/
function useIsExporting() {
	const [exporting, setExporting] = (0, import_react.useState)(isExportingNow);
	(0, import_react.useEffect)(() => {
		const el = document.documentElement;
		const update = () => setExporting(el.getAttribute(EXPORT_ATTR) === CAPTURE);
		update();
		const observer = new MutationObserver(update);
		observer.observe(el, {
			attributes: true,
			attributeFilter: [EXPORT_ATTR]
		});
		return () => observer.disconnect();
	}, []);
	return exporting;
}
//#endregion
//#region node_modules/@deckio/deck-engine/context/SlideContext.jsx
var import_jsx_runtime = require_jsx_runtime();
var GitHubStarPrompt = (0, import_react.lazy)(() => import("./GitHubStarPrompt-C0aTi6BS.js"));
var STAR_PROMPT_DEV = (() => {
	try {
		return Boolean(import.meta && import.meta.env && import.meta.env.DEV);
	} catch {
		return false;
	}
})();
var SlideContext = (0, import_react.createContext)();
/**
* Read initial slide from URL search params (?slide=N).
* Takes priority over sessionStorage — enables deep-linking and
* server-side capture (thumbnail service, vision capture) without postMessage.
* Returns null if not present or invalid.
*/
function getSlideFromUrl(totalSlides) {
	try {
		const raw = new URLSearchParams(window.location.search).get("slide");
		if (raw === null) return null;
		const idx = parseInt(raw, 10);
		return Number.isFinite(idx) && idx >= 0 && idx < totalSlides ? idx : null;
	} catch {
		return null;
	}
}
/**
* Recover the last-viewed slide from sessionStorage.
* Survives Vite HMR so you stay on the same slide during dev.
*
*   sessionStorage key format:  slide:<project>
*   returns 0 when nothing stored or value is out of range.
*/
function getStoredSlide(project, totalSlides) {
	try {
		const idx = parseInt(sessionStorage.getItem(`slide:${project}`), 10);
		return Number.isFinite(idx) && idx >= 0 && idx < totalSlides ? idx : 0;
	} catch {
		return 0;
	}
}
/**
* Decide the initial edit/present mode (URL params + prop + dev flag).
*/
function resolveInitialMode(modeProp) {
	let search = "";
	try {
		search = window.location.search;
	} catch {}
	return resolveInitialMode$1(search, modeProp, import.meta.env?.DEV);
}
var DEFAULT_THEME = "dark";
var INTERACTIVE_KEY_TARGET = "button, a, input, textarea, select, [contenteditable], [role=\"button\"], [role=\"link\"]";
function isInteractiveKeyTarget(target) {
	return target instanceof Element && Boolean(target.closest(INTERACTIVE_KEY_TARGET));
}
function SlideProvider({ children, totalSlides, project, slides, theme, hiddenSlides, mode }) {
	const [current, setCurrent] = (0, import_react.useState)(() => getSlideFromUrl(totalSlides) ?? getStoredSlide(project, totalSlides));
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const [activeTheme, setActiveTheme] = (0, import_react.useState)(theme || DEFAULT_THEME);
	const [activeMode, setActiveMode] = (0, import_react.useState)(() => resolveInitialMode(mode));
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const sync = () => {
			try {
				setIsFullscreen(Boolean(document.fullscreenElement));
			} catch {
				setIsFullscreen(false);
			}
		};
		sync();
		document.addEventListener("fullscreenchange", sync);
		return () => document.removeEventListener("fullscreenchange", sync);
	}, []);
	const hiddenKey = JSON.stringify(Array.isArray(hiddenSlides) ? hiddenSlides : []);
	const [hidden, setHidden] = (0, import_react.useState)(() => normalizeHidden(hiddenSlides, totalSlides));
	(0, import_react.useEffect)(() => {
		setHidden(normalizeHidden(hiddenSlides, totalSlides));
	}, [hiddenKey, totalSlides]);
	const hiddenSet = (0, import_react.useMemo)(() => new Set(hidden), [hidden]);
	const effectiveMode = resolveEffectiveMode(activeMode, isFullscreen);
	const visibleIndices = (0, import_react.useMemo)(() => computeVisibleIndices(totalSlides, hiddenSet, effectiveMode), [
		totalSlides,
		effectiveMode,
		hiddenSet
	]);
	const { displayIndex, visibleCount, progress, atStart, atEnd, firstVisibleIndex } = displayMetrics(current, visibleIndices, effectiveMode, totalSlides);
	(0, import_react.useEffect)(() => {
		document.documentElement.setAttribute("data-theme", activeTheme);
		return () => document.documentElement.removeAttribute("data-theme");
	}, [activeTheme]);
	(0, import_react.useEffect)(() => {
		if (theme && theme !== activeTheme) setActiveTheme(theme);
	}, [theme]);
	(0, import_react.useEffect)(() => {
		if ((mode === "edit" || mode === "present") && mode !== activeMode) setActiveMode(mode);
	}, [mode]);
	(0, import_react.useEffect)(() => {
		try {
			sessionStorage.setItem(`slide:${project}`, current);
		} catch {}
	}, [current, project]);
	(0, import_react.useEffect)(() => {
		try {
			if (window.parent && window.parent !== window) {
				const slideName = slides?.[current]?.displayName || slides?.[current]?.name || "";
				window.parent.postMessage({
					type: "deck:slide",
					project,
					slideIndex: current,
					slideName,
					totalSlides,
					hiddenSlides: hidden,
					mode: effectiveMode,
					displayIndex,
					visibleCount
				}, "*");
			}
		} catch {}
	}, [
		current,
		project,
		totalSlides,
		slides,
		hidden,
		effectiveMode,
		displayIndex,
		visibleCount
	]);
	const go = (0, import_react.useCallback)((dir) => {
		setCurrent((prev) => stepVisible(prev, dir, visibleIndices, effectiveMode, totalSlides));
	}, [
		effectiveMode,
		totalSlides,
		visibleIndices
	]);
	const goTo = (0, import_react.useCallback)((idx) => {
		const resolved = resolveGoTo(idx, effectiveMode, hiddenSet, visibleIndices, totalSlides);
		if (resolved != null) setCurrent(resolved);
	}, [
		effectiveMode,
		totalSlides,
		hiddenSet,
		visibleIndices
	]);
	(0, import_react.useEffect)(() => {
		const snap = snapToVisible(current, effectiveMode, hiddenSet, visibleIndices, totalSlides);
		if (snap != null) setCurrent(snap);
	}, [
		effectiveMode,
		current,
		hiddenSet,
		visibleIndices,
		totalSlides
	]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (isExportingNow()) return;
			if (isInteractiveKeyTarget(e.target)) return;
			if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown" || e.key === "Enter") {
				e.preventDefault();
				go(1);
			}
			if (e.key === "ArrowLeft" || e.key === "PageUp") {
				e.preventDefault();
				go(-1);
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [go]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.data?.type === "deck:goTo" && e.data.project === project) {
				const idx = e.data.slideIndex;
				if (typeof idx === "number" && idx >= 0 && idx < totalSlides) setCurrent(idx);
			}
		};
		window.addEventListener("message", handler);
		return () => window.removeEventListener("message", handler);
	}, [project, totalSlides]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.data?.type === "deck:setMode" && e.data.project === project) {
				const m = e.data.mode;
				if (m === "edit" || m === "present") setActiveMode(m);
			}
		};
		window.addEventListener("message", handler);
		return () => window.removeEventListener("message", handler);
	}, [project]);
	(0, import_react.useEffect)(() => {
		let touchX = 0;
		const onStart = (e) => {
			touchX = e.changedTouches[0].screenX;
		};
		const onEnd = (e) => {
			const diff = touchX - e.changedTouches[0].screenX;
			if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
		};
		document.addEventListener("touchstart", onStart);
		document.addEventListener("touchend", onEnd);
		return () => {
			document.removeEventListener("touchstart", onStart);
			document.removeEventListener("touchend", onEnd);
		};
	}, [go]);
	const isHidden = (0, import_react.useCallback)((idx) => hiddenSet.has(idx), [hiddenSet]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SlideContext.Provider, {
		value: {
			current,
			totalSlides,
			go,
			goTo,
			selectedCustomer,
			setSelectedCustomer,
			project,
			theme: activeTheme,
			setTheme: setActiveTheme,
			mode: effectiveMode,
			setMode: setActiveMode,
			hiddenSlides: hidden,
			isHidden,
			visibleIndices,
			visibleCount,
			displayIndex,
			progress,
			atStart,
			atEnd,
			firstVisibleIndex,
			isFullscreen
		},
		children: [children, STAR_PROMPT_DEV && effectiveMode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitHubStarPrompt, { editMode: true })
		})]
	});
}
function useSlides() {
	return (0, import_react.useContext)(SlideContext);
}
//#endregion
//#region node_modules/@deckio/deck-engine/context/useDisclosure.js
/**
* Progressive disclosure — the standard, export-safe step machine.
*
* This is the one blessed way to build "click to reveal" slides. It keeps the
* tricky parts in the engine so every slide behaves identically and, crucially,
* stays export-compatible:
*
*   • Live: forward keys (→ / Space / PageDown / Enter) advance one step while
*     the slide is active; ← / PageUp step back. Events are intercepted in the
*     capture phase and only allowed to bubble (and thus navigate to the next
*     slide) once every step is revealed — so disclosure and navigation compose
*     cleanly.
*   • Export: while a PDF/PPTX capture is running (see useIsExporting) the hook
*     reports the fully-revealed state and detaches its key listener, so the
*     exported image always shows the slide's final state instead of its
*     pre-disclosure (mostly-hidden) one. No per-deck wiring required.
*
* Usage:
*
*   const { step, isRevealed } = useDisclosure(items.length, { index })
*   // i < step  →  item i is revealed
*   items.map((it, i) => <Row className={isRevealed(i) ? 'in' : 'out'} />)
*
* Threshold-style slides can read `step` directly (e.g. `step >= 3`).
*
* @param {number} total - number of reveal steps (final step value).
* @param {object} [options]
* @param {number} [options.index] - this slide's index; when provided the hook
*   only listens while `current === index`. Omit for always-active slides.
* @param {number} [options.initial=0] - starting (and reset) step.
* @returns {{
*   step: number, total: number, isActive: boolean, exporting: boolean,
*   atStart: boolean, atEnd: boolean, isRevealed: (i: number) => boolean,
*   next: () => void, prev: () => void, setStep: (s: number) => void,
* }}
*/
function useDisclosure(total, options = {}) {
	const { index, initial = 0 } = options;
	const safeTotal = Math.max(0, Math.floor(Number(total) || 0));
	const safeInitial = Math.min(safeTotal, Math.max(0, Math.floor(Number(initial) || 0)));
	const { current } = useSlides();
	const exporting = useIsExporting();
	const isActive = index == null ? true : current === index;
	const [step, setStep] = (0, import_react.useState)(safeInitial);
	(0, import_react.useEffect)(() => {
		if (!isActive) setStep(safeInitial);
	}, [isActive, safeInitial]);
	(0, import_react.useEffect)(() => {
		if (!isActive || exporting) return;
		const handler = (e) => {
			const forward = e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar" || e.key === "PageDown" || e.key === "Enter";
			const backward = e.key === "ArrowLeft" || e.key === "PageUp";
			if (forward && step < safeTotal) {
				e.stopImmediatePropagation();
				e.preventDefault();
				setStep((s) => Math.min(safeTotal, s + 1));
			} else if (backward && step > safeInitial) {
				e.stopImmediatePropagation();
				e.preventDefault();
				setStep((s) => Math.max(safeInitial, s - 1));
			}
		};
		document.addEventListener("keydown", handler, { capture: true });
		return () => document.removeEventListener("keydown", handler, { capture: true });
	}, [
		isActive,
		exporting,
		step,
		safeTotal,
		safeInitial
	]);
	const effectiveStep = exporting ? safeTotal : step;
	return {
		step: effectiveStep,
		total: safeTotal,
		isActive,
		exporting,
		atStart: effectiveStep <= safeInitial,
		atEnd: effectiveStep >= safeTotal,
		isRevealed: (i) => i < effectiveStep,
		next: () => setStep((s) => Math.min(safeTotal, s + 1)),
		prev: () => setStep((s) => Math.max(safeInitial, s - 1)),
		setStep: (s) => setStep(() => Math.min(safeTotal, Math.max(safeInitial, Math.floor(Number(s) || 0))))
	};
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/Slide.jsx
var DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV;
function Slide({ index, className = "", children }) {
	const { current, mode, isHidden } = useSlides();
	const ref = (0, import_react.useRef)(null);
	const [overflow, setOverflow] = (0, import_react.useState)(false);
	let stateClass = "";
	if (index === current) stateClass = "active";
	else if (index < current) stateClass = "exit-left";
	const hiddenClass = (typeof isHidden === "function" ? isHidden(index) : false) && mode === "edit" && index === current ? "deckio-slide--hidden" : "";
	(0, import_react.useEffect)(() => {
		if (!DEV || index !== current || !ref.current) return;
		const el = ref.current;
		const check = () => {
			const hasOverflow = Array.from(el.children).some((c) => {
				const pos = getComputedStyle(c).position;
				if (pos === "absolute" || pos === "fixed") return false;
				return c.offsetTop + c.offsetHeight > el.clientHeight;
			});
			setOverflow(hasOverflow);
		};
		check();
		const obs = new ResizeObserver(check);
		obs.observe(el);
		return () => obs.disconnect();
	}, [index, current]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: `slide ${stateClass} ${hiddenClass} ${className}`,
		"data-slide": index,
		children: [children, DEV && overflow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "slide-overflow-warn",
			children: "⚠ Content overflows slide — reduce content or use smaller elements"
		})]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/EditableToolbar.jsx
/**
* EditableToolbar — floating dev-only style toolbar for the active <Editable>.
*
* Anu UX guardrails (anu-inline-edit-style-toolbar.md):
*   - One toolbar at a time, anchored above the active field.
*   - Theme tokens shown first ("Theme" row); free hex picker is behind
*     an "Advanced" disclosure so non-designers can't paint themselves
*     into a contrast hole.
*   - Mouse interaction inside the toolbar must NOT blur the
*     contentEditable. Achieved via `data-deckio-toolbar-root` and the
*     Editable's blur handler checking `relatedTarget.closest(...)`.
*   - Hidden by default; appears only when `ctx.activeField` is set.
*   - Tagged `data-deckio-export-ignore="true"` so PDF/PNG export skips it.
*   - No persistent badge in source; pure runtime UI.
*
* Positioning:
*   ResizeObserver on the anchor + window scroll/resize listeners. The
*   toolbar floats above the anchor by default; if there isn't enough
*   space above, it flips below. Horizontally clamped to the viewport.
*
* Persistence:
*   Calls `ctx.save(field, { style: {...} })`. The server merges the new
*   facets onto the existing entry (preserves value, preserves other
*   style keys we didn't touch). Toolbar never sends a `value` patch.
*/
var import_react_dom = require_react_dom();
var THEME_COLOR_SWATCHES = [
	{
		value: "var(--accent)",
		label: "Accent"
	},
	{
		value: "var(--accent-2)",
		label: "Accent 2"
	},
	{
		value: "var(--foreground)",
		label: "Foreground"
	},
	{
		value: "var(--muted)",
		label: "Muted"
	},
	{
		value: "var(--background)",
		label: "Background"
	}
];
var FONT_FAMILY_OPTIONS = [
	{
		value: "",
		label: "Default"
	},
	{
		value: "var(--font-sans)",
		label: "Theme sans"
	},
	{
		value: "var(--font-serif)",
		label: "Theme serif"
	},
	{
		value: "var(--font-mono)",
		label: "Theme mono"
	},
	{
		value: "var(--font-display)",
		label: "Theme display"
	},
	{
		value: "Inter",
		label: "Inter"
	},
	{
		value: "system-ui",
		label: "System"
	},
	{
		value: "serif",
		label: "Serif"
	},
	{
		value: "sans-serif",
		label: "Sans-serif"
	},
	{
		value: "monospace",
		label: "Mono"
	}
];
var FONT_SIZE_STEPS = [
	"0.75rem",
	"0.875rem",
	"1rem",
	"1.125rem",
	"1.25rem",
	"1.5rem",
	"1.875rem",
	"2.25rem",
	"3rem",
	"3.75rem",
	"4.5rem"
];
var TEXT_ALIGN_OPTIONS = [
	{
		value: "left",
		label: "Align left",
		icon: "L"
	},
	{
		value: "center",
		label: "Align center",
		icon: "C"
	},
	{
		value: "right",
		label: "Align right",
		icon: "R"
	}
];
var TOOLBAR_OFFSET = 10;
var TOOLBAR_MIN_MARGIN = 6;
function readEntryStyle(entry) {
	if (!entry || typeof entry !== "object") return null;
	if (Object.prototype.hasOwnProperty.call(entry, "order")) return null;
	return entry.style && typeof entry.style === "object" ? entry.style : null;
}
function parseSizeStepIndex(value) {
	if (!value) return -1;
	return FONT_SIZE_STEPS.indexOf(value);
}
function nextSize(current, dir) {
	if (!current) return dir > 0 ? FONT_SIZE_STEPS[3] : FONT_SIZE_STEPS[2];
	const i = parseSizeStepIndex(current);
	if (i < 0) return dir > 0 ? FONT_SIZE_STEPS[3] : FONT_SIZE_STEPS[2];
	return FONT_SIZE_STEPS[Math.max(0, Math.min(FONT_SIZE_STEPS.length - 1, i + dir))];
}
function isHexColor(s) {
	return typeof s === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s.trim());
}
function EditableToolbar() {
	const ctx = (0, import_react.useContext)(InlineEditContext);
	const rootRef = (0, import_react.useRef)(null);
	const [pos, setPos] = (0, import_react.useState)(null);
	const [advanced, setAdvanced] = (0, import_react.useState)(false);
	const [pendingFreeHex, setPendingFreeHex] = (0, import_react.useState)("");
	const activeField = ctx && ctx.activeField;
	const activeElement = ctx && ctx.activeElementRef ? ctx.activeElementRef.current : null;
	const entryStyle = (0, import_react.useMemo)(() => {
		if (!ctx || !activeField) return null;
		return readEntryStyle(ctx.overrides && ctx.overrides[activeField]);
	}, [ctx, activeField]);
	const reposition = (0, import_react.useCallback)(() => {
		if (!activeElement || !rootRef.current) return;
		const anchorRect = activeElement.getBoundingClientRect();
		const root = rootRef.current;
		const tw = root.offsetWidth || 240;
		const th = root.offsetHeight || 36;
		const viewportW = window.innerWidth;
		const viewportH = window.innerHeight;
		let top = anchorRect.top - th - TOOLBAR_OFFSET;
		if (top < TOOLBAR_MIN_MARGIN) {
			const below = anchorRect.bottom + TOOLBAR_OFFSET;
			if (below + th + TOOLBAR_MIN_MARGIN <= viewportH) top = below;
			else top = TOOLBAR_MIN_MARGIN;
		}
		let left = anchorRect.left + anchorRect.width / 2 - tw / 2;
		if (left < TOOLBAR_MIN_MARGIN) left = TOOLBAR_MIN_MARGIN;
		if (left + tw + TOOLBAR_MIN_MARGIN > viewportW) left = viewportW - tw - TOOLBAR_MIN_MARGIN;
		setPos({
			top: Math.round(top),
			left: Math.round(left)
		});
	}, [activeElement]);
	(0, import_react.useEffect)(() => {
		if (!activeElement) {
			setPos(null);
			return;
		}
		reposition();
		const onScroll = () => reposition();
		const onResize = () => reposition();
		let ro = null;
		if (typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(() => reposition());
			ro.observe(activeElement);
			if (rootRef.current) ro.observe(rootRef.current);
		}
		window.addEventListener("scroll", onScroll, true);
		window.addEventListener("resize", onResize);
		return () => {
			if (ro) ro.disconnect();
			window.removeEventListener("scroll", onScroll, true);
			window.removeEventListener("resize", onResize);
		};
	}, [activeElement, reposition]);
	(0, import_react.useEffect)(() => {
		setAdvanced(false);
		setPendingFreeHex("");
	}, [activeField]);
	if (!ctx || !ctx.isDev || !activeField || !activeElement) return null;
	if (typeof document === "undefined" || !document.body) return null;
	const patchStyle = async (mutation) => {
		const nextStyle = {
			...entryStyle && typeof entryStyle === "object" ? entryStyle : {},
			...mutation
		};
		for (const k of Object.keys(nextStyle)) if (nextStyle[k] == null || nextStyle[k] === "") delete nextStyle[k];
		await ctx.save(activeField, { style: nextStyle });
	};
	const currentFont = entryStyle && entryStyle.fontFamily || "";
	const currentSize = entryStyle && entryStyle.fontSize || "";
	const currentColor = entryStyle && entryStyle.color || "";
	const currentWeight = entryStyle && entryStyle.fontWeight || "";
	const currentStyleAttr = entryStyle && entryStyle.fontStyle || "";
	const currentAlign = entryStyle && entryStyle.textAlign || "";
	const isBold = currentWeight === "bold" || currentWeight === 700 || currentWeight === "700";
	const isItalic = currentStyleAttr === "italic";
	const node = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "deckio-editable-toolbar",
		"data-deckio-toolbar-root": "",
		"data-deckio-export-ignore": "true",
		"data-html2canvas-ignore": "true",
		role: "toolbar",
		"aria-label": "Text style",
		style: pos ? {
			position: "fixed",
			top: pos.top,
			left: pos.left,
			visibility: "visible"
		} : {
			position: "fixed",
			top: -9999,
			left: -9999,
			visibility: "hidden"
		},
		onMouseDown: (e) => {
			const t = e.target;
			if (t && (t.tagName === "SELECT" || t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
			e.preventDefault();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "deckio-editable-toolbar__select",
				"aria-label": "Font family",
				value: currentFont,
				onChange: (e) => {
					patchStyle({ fontFamily: e.target.value || void 0 });
				},
				children: FONT_FAMILY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: opt.value,
					children: opt.label
				}, opt.value || "__default"))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deckio-editable-toolbar__group",
				role: "group",
				"aria-label": "Font size",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "deckio-editable-toolbar__btn",
						"aria-label": "Decrease size",
						onClick: () => {
							patchStyle({ fontSize: nextSize(currentSize, -1) });
						},
						children: "A−"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "deckio-editable-toolbar__readout",
						title: currentSize || "Default",
						children: currentSize || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "deckio-editable-toolbar__btn",
						"aria-label": "Increase size",
						onClick: () => {
							patchStyle({ fontSize: nextSize(currentSize, 1) });
						},
						children: "A+"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deckio-editable-toolbar__group",
				role: "group",
				"aria-label": "Text formatting",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `deckio-editable-toolbar__btn ${isBold ? "is-active" : ""}`,
					"aria-pressed": isBold ? "true" : "false",
					"aria-label": "Bold",
					onClick: () => {
						patchStyle({ fontWeight: isBold ? void 0 : "bold" });
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "B" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `deckio-editable-toolbar__btn ${isItalic ? "is-active" : ""}`,
					"aria-pressed": isItalic ? "true" : "false",
					"aria-label": "Italic",
					onClick: () => {
						patchStyle({ fontStyle: isItalic ? void 0 : "italic" });
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "I" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "deckio-editable-toolbar__group",
				role: "group",
				"aria-label": "Text align",
				children: TEXT_ALIGN_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `deckio-editable-toolbar__btn ${currentAlign === opt.value ? "is-active" : ""}`,
					"aria-pressed": currentAlign === opt.value ? "true" : "false",
					"aria-label": opt.label,
					onClick: () => {
						patchStyle({ textAlign: currentAlign === opt.value ? void 0 : opt.value });
					},
					children: opt.icon
				}, opt.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deckio-editable-toolbar__group deckio-editable-toolbar__swatches",
				role: "group",
				"aria-label": "Color",
				children: [THEME_COLOR_SWATCHES.map((sw) => {
					const active = currentColor === sw.value;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `deckio-editable-toolbar__swatch ${active ? "is-active" : ""}`,
						"aria-pressed": active ? "true" : "false",
						"aria-label": `Color ${sw.label}`,
						title: sw.label,
						style: { background: sw.value },
						onClick: () => {
							patchStyle({ color: active ? void 0 : sw.value });
						}
					}, sw.value);
				}), currentColor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "deckio-editable-toolbar__btn",
					"aria-label": "Clear color",
					title: "Clear color",
					onClick: () => {
						patchStyle({ color: void 0 });
					},
					children: "×"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `deckio-editable-toolbar__btn deckio-editable-toolbar__advanced ${advanced ? "is-active" : ""}`,
				"aria-expanded": advanced ? "true" : "false",
				"aria-label": "Advanced",
				onClick: () => setAdvanced((v) => !v),
				children: "…"
			}),
			advanced ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deckio-editable-toolbar__advanced-panel",
				role: "group",
				"aria-label": "Advanced color",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "color",
					className: "deckio-editable-toolbar__colorpicker",
					"aria-label": "Custom color",
					value: isHexColor(currentColor) ? currentColor : "#ffffff",
					onChange: (e) => {
						patchStyle({ color: e.target.value });
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					className: "deckio-editable-toolbar__hexinput",
					"aria-label": "Custom hex",
					placeholder: "#hex",
					value: pendingFreeHex,
					onChange: (e) => setPendingFreeHex(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							if (isHexColor(pendingFreeHex)) patchStyle({ color: pendingFreeHex.trim() });
						}
					}
				})]
			}) : null
		]
	});
	return (0, import_react_dom.createPortal)(node, document.body);
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/Editable.jsx
/**
* Editable — local-dev inline text editing primitive (Decision 63 MVP).
*
* UX guardrails (Anu, see .squad/decisions/inbox/anu-inline-edit-ux.md and
* anu-inline-edit-toast.md):
*   - Activation: plain double-click, plus F2/Enter when focused (a11y).
*   - Single click never starts editing or steals focus.
*   - Affordance is dev-only and emitted by `styles/editable.css`. No layout
*     shift, no persistent badges.
*   - While editing, navigation shortcuts must not steal arrows / space /
*     Enter / Escape / Home / End / selection / copy / paste / IME.
*     We achieve that with `event.stopPropagation()` on every key while
*     editing — SlideContext's keydown listener is mounted on `document`
*     and is reached only after React's root delegation, so a stopped
*     synthetic event is enough.
*   - Enter saves single-line. Escape cancels and restores. Blur saves
*     only when content actually changed and validation passes. Shift+Enter
*     inserts a line break only when `multiline` is set.
*   - Empty values are rejected unless `allowEmpty` is set. The
*     "This field can't be empty." validation is field-local because it
*     blocks editing — it is not a source-save lifecycle event.
*   - Source-save lifecycle ("Saving…" / "Saved to source" /
*     "Couldn't save." / "Source changed. Refresh and try again.") is
*     surfaced by a single dev-only global toast portaled to <body>,
*     anchored bottom-right with safe-area inset. One status at a time;
*     rapid saves coalesce. Polite for saving/saved, assertive for
*     error/conflict. Conflict persists until the next save or dismiss.
*   - In production / no provider: pure render, no listeners, no
*     contenteditable attribute, no status UI, no toast DOM.
*
* v2 path: this component stays declarative. The endpoint + storage may
* be swapped for an AST patcher without touching slide JSX.
*/
function isDevEnv() {
	try {
		return Boolean(import.meta && import.meta.env && import.meta.env.DEV);
	} catch {
		return false;
	}
}
function normalizeEntryClient(raw) {
	if (typeof raw === "string") return { value: raw };
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const hasValue = Object.prototype.hasOwnProperty.call(raw, "value");
	const hasStyle = Object.prototype.hasOwnProperty.call(raw, "style");
	const hasOrder = Object.prototype.hasOwnProperty.call(raw, "order");
	const hasBase = Object.prototype.hasOwnProperty.call(raw, "base");
	if (hasOrder && (hasValue || hasStyle || hasBase)) return null;
	if (hasOrder) {
		if (!Array.isArray(raw.order)) return null;
		const cleaned = [];
		for (const id of raw.order) {
			if (typeof id !== "string" || !id) return null;
			cleaned.push(id);
		}
		return { order: cleaned };
	}
	if (hasValue || hasStyle || hasBase) {
		const out = {};
		if (hasValue) {
			if (typeof raw.value !== "string") return null;
			out.value = raw.value;
		}
		if (hasStyle) {
			if (!raw.style || typeof raw.style !== "object" || Array.isArray(raw.style)) return null;
			const styleOut = {};
			for (const k of Object.keys(raw.style)) {
				const v = raw.style[k];
				if (typeof v !== "string" && typeof v !== "number") continue;
				styleOut[k] = v;
			}
			out.style = styleOut;
		}
		if (hasBase) {
			if (typeof raw.base !== "string") return null;
			out.base = raw.base;
		}
		return out;
	}
	return null;
}
function normalizeOverrides(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out = {};
	for (const key of Object.keys(raw)) {
		if (typeof key !== "string" || !key) continue;
		const entry = normalizeEntryClient(raw[key]);
		if (entry == null) continue;
		out[key] = entry;
	}
	return out;
}
function toReactStyleObject(rawStyle) {
	if (!rawStyle || typeof rawStyle !== "object") return null;
	const out = {};
	let any = false;
	for (const k of Object.keys(rawStyle)) {
		const v = rawStyle[k];
		if (typeof v !== "string" && typeof v !== "number") continue;
		const camel = k.includes("-") ? k.replace(/-([a-z])/g, (_m, c) => c.toUpperCase()) : k;
		out[camel] = v;
		any = true;
	}
	return any ? out : null;
}
function mergeEntryClient(prevEntry, patch) {
	if (!patch || typeof patch !== "object") return prevEntry;
	const hasValue = Object.prototype.hasOwnProperty.call(patch, "value");
	const hasStyle = Object.prototype.hasOwnProperty.call(patch, "style");
	const hasOrder = Object.prototype.hasOwnProperty.call(patch, "order");
	const hasBase = Object.prototype.hasOwnProperty.call(patch, "base");
	if (hasOrder) return normalizeEntryClient({ order: patch.order });
	if (!hasValue && !hasStyle && !hasBase) return prevEntry;
	const prevText = prevEntry && typeof prevEntry === "object" && !Array.isArray(prevEntry) && !Object.prototype.hasOwnProperty.call(prevEntry, "order") ? prevEntry : null;
	const next = { ...prevText || {} };
	if (hasValue) next.value = patch.value;
	if (hasStyle) next.style = {
		...prevText && prevText.style ? prevText.style : {},
		...patch.style || {}
	};
	if (hasBase) next.base = patch.base;
	return normalizeEntryClient(next);
}
function defaultInlineEditEndpoint() {
	let base = "/";
	try {
		if (import.meta && import.meta.env && typeof import.meta.env.BASE_URL === "string") base = import.meta.env.BASE_URL || "/";
	} catch {}
	if (!base.endsWith("/")) base = `${base}/`;
	return `${base}__deckio/inline-edit`;
}
var TOAST_TIMINGS = Object.freeze({
	saved: 2200,
	error: 6e3,
	conflict: 0
});
function InlineEditProvider({ overrides: initialOverrides = {}, project, endpoint, enabled, children }) {
	const resolvedEndpoint = endpoint || defaultInlineEditEndpoint();
	const [overrides, setOverrides] = (0, import_react.useState)(() => normalizeOverrides(initialOverrides));
	const hashRef = (0, import_react.useRef)(null);
	const isDev = (0, import_react.useMemo)(() => typeof enabled === "boolean" ? enabled : isDevEnv(), [enabled]);
	const [saveStatus, setSaveStatus] = (0, import_react.useState)(null);
	const dismissTimerRef = (0, import_react.useRef)(null);
	const [activeField, setActiveFieldState] = (0, import_react.useState)(null);
	const activeElementRef = (0, import_react.useRef)(null);
	const setActiveField = (0, import_react.useCallback)((field, element) => {
		activeElementRef.current = element || null;
		setActiveFieldState(field || null);
	}, []);
	const clearActiveField = (0, import_react.useCallback)((field) => {
		setActiveFieldState((cur) => {
			if (field != null && cur !== field) return cur;
			activeElementRef.current = null;
			return null;
		});
	}, []);
	const clearDismissTimer = (0, import_react.useCallback)(() => {
		if (dismissTimerRef.current) {
			clearTimeout(dismissTimerRef.current);
			dismissTimerRef.current = null;
		}
	}, []);
	const dismissSaveStatus = (0, import_react.useCallback)(() => {
		clearDismissTimer();
		setSaveStatus(null);
	}, [clearDismissTimer]);
	(0, import_react.useEffect)(() => () => clearDismissTimer(), [clearDismissTimer]);
	const save = (0, import_react.useCallback)(async (field, patchOrValue) => {
		if (!isDev) return {
			ok: false,
			reason: "not-dev"
		};
		const patch = typeof patchOrValue === "string" ? { value: patchOrValue } : patchOrValue && typeof patchOrValue === "object" && !Array.isArray(patchOrValue) ? patchOrValue : null;
		if (!patch) return {
			ok: false,
			reason: "invalid-patch"
		};
		clearDismissTimer();
		setSaveStatus("saving");
		const MAX_SAVE_ATTEMPTS = 2;
		for (let attempt = 1; attempt <= MAX_SAVE_ATTEMPTS; attempt++) {
			let res;
			try {
				res = await fetch(resolvedEndpoint, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						kind: "override",
						project,
						field,
						patch,
						baseHash: hashRef.current || void 0
					})
				});
			} catch (err) {
				setSaveStatus("error");
				scheduleAutoDismiss("error");
				return {
					ok: false,
					reason: "network",
					message: String(err && err.message || err)
				};
			}
			let body = null;
			try {
				body = await res.json();
			} catch {}
			if (res.status === 409) {
				if (body && body.hash) hashRef.current = body.hash;
				if (attempt < MAX_SAVE_ATTEMPTS) continue;
				setSaveStatus("conflict");
				scheduleAutoDismiss("conflict");
				return {
					ok: false,
					reason: "conflict"
				};
			}
			if (!res.ok) {
				setSaveStatus("error");
				scheduleAutoDismiss("error");
				return {
					ok: false,
					reason: `http-${res.status}`,
					error: body && body.error
				};
			}
			if (body && body.hash) hashRef.current = body.hash;
			setOverrides((prev) => {
				const next = { ...prev };
				const serverEntry = body && Object.prototype.hasOwnProperty.call(body, "entry") ? normalizeEntryClient(body.entry) : null;
				if (serverEntry != null) next[field] = serverEntry;
				else {
					next[field] = mergeEntryClient(normalizeEntryClient(prev[field]), patch);
					if (next[field] == null) delete next[field];
				}
				return next;
			});
			setSaveStatus("saved");
			scheduleAutoDismiss("saved");
			return { ok: true };
		}
		return {
			ok: false,
			reason: "conflict"
		};
		function scheduleAutoDismiss(kind) {
			const ms = TOAST_TIMINGS[kind] || 0;
			if (!ms) return;
			clearDismissTimer();
			dismissTimerRef.current = setTimeout(() => {
				dismissTimerRef.current = null;
				setSaveStatus((cur) => cur === kind ? null : cur);
			}, ms);
		}
	}, [
		resolvedEndpoint,
		isDev,
		project,
		clearDismissTimer
	]);
	const value = (0, import_react.useMemo)(() => ({
		overrides,
		save,
		isDev,
		saveStatus,
		dismissSaveStatus,
		activeField,
		activeElementRef,
		setActiveField,
		clearActiveField
	}), [
		overrides,
		save,
		isDev,
		saveStatus,
		dismissSaveStatus,
		activeField,
		setActiveField,
		clearActiveField
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineEditContext.Provider, {
		value,
		children: [
			children,
			isDev ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineEditToast, {
				status: saveStatus,
				onDismiss: dismissSaveStatus
			}) : null,
			isDev ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableToolbar, {}) : null
		]
	});
}
var EditableProvider = InlineEditProvider;
function useInlineEdit() {
	return (0, import_react.useContext)(InlineEditContext);
}
function useInlineEditEntry(field) {
	const ctx = (0, import_react.useContext)(InlineEditContext);
	if (!ctx) return null;
	if (!Object.prototype.hasOwnProperty.call(ctx.overrides, field)) return null;
	const entry = ctx.overrides[field];
	return entry && typeof entry === "object" ? entry : null;
}
function useInlineEditValue(field, fallback) {
	const ctx = (0, import_react.useContext)(InlineEditContext);
	if (!ctx) return fallback;
	if (!Object.prototype.hasOwnProperty.call(ctx.overrides, field)) return fallback;
	const entry = ctx.overrides[field];
	if (!entry || typeof entry !== "object") return fallback;
	if (Object.prototype.hasOwnProperty.call(entry, "order")) return fallback;
	return typeof entry.value === "string" ? entry.value : fallback;
}
var useEditable = useInlineEdit;
var useEditableValue = useInlineEditValue;
var STATUS_TEXT = { empty: "This field can’t be empty." };
var TOAST_STATUS_TEXT = Object.freeze({
	saving: "Saving…",
	saved: "Saved to source",
	error: "Couldn’t save.",
	conflict: "Source changed. Refresh and try again."
});
function InlineEditToastIcon({ status }) {
	const common = {
		width: 14,
		height: 14,
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.75,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		focusable: "false"
	};
	if (status === "saving") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...common,
		className: "deckio-inline-edit-toast__icon deckio-inline-edit-toast__icon--spin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 8a6 6 0 1 1-6-6" })
	});
	if (status === "saved") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...common,
		className: "deckio-inline-edit-toast__icon",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 8.5l3 3 6-7" })
	});
	if (status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...common,
		className: "deckio-inline-edit-toast__icon",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2.5L14.5 13.5h-13z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 7v3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 12.25v.01" })
		]
	});
	if (status === "conflict") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...common,
		className: "deckio-inline-edit-toast__icon",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.5 4.5v3h-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.8 9.5A5.5 5.5 0 0 0 13 11" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 11.5v-3h3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.2 6.5A5.5 5.5 0 0 0 3 5" })
		]
	});
	return null;
}
function InlineEditToast({ status, onDismiss }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;
	if (typeof document === "undefined" || !document.body) return null;
	const text = status ? TOAST_STATUS_TEXT[status] : null;
	const isAlert = status === "error" || status === "conflict";
	const node = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "deckio-inline-edit-toast-root",
		"data-deckio-toast-root": "",
		"data-html2canvas-ignore": "true",
		"data-deckio-export-ignore": "true",
		"aria-live": isAlert ? "assertive" : "polite",
		role: isAlert ? "alert" : "status",
		children: text ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `deckio-inline-edit-toast deckio-inline-edit-toast--${status}`,
			"data-deckio-toast-status": status,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineEditToastIcon, { status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "deckio-inline-edit-toast__text",
					children: text
				}),
				status === "conflict" || status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "deckio-inline-edit-toast__dismiss",
					onClick: onDismiss,
					"aria-label": "Dismiss save status",
					children: "×"
				}) : null
			]
		}) : null
	});
	return (0, import_react_dom.createPortal)(node, document.body);
}
function normalizeEditableText(raw, multiline) {
	const s = raw == null ? "" : String(raw);
	return multiline ? s.replace(/\r\n/g, "\n") : s.replace(/[\r\n]+/g, " ").trim();
}
function placeCaretAtEnd(node) {
	try {
		node.focus({ preventScroll: true });
		const range = document.createRange();
		range.selectNodeContents(node);
		range.collapse(false);
		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
	} catch {}
}
var Editable = (0, import_react.forwardRef)(function Editable({ id, field: fieldProp, as: Tag = "span", children, fallback, className, multiline = false, allowEmpty = false, label, onClick, onDoubleClick, onKeyDown, onFocus, onBlur, style: styleProp, ...rest }, externalRef) {
	const field = typeof id === "string" && id ? id : fieldProp;
	const ctx = (0, import_react.useContext)(InlineEditContext);
	const localRef = (0, import_react.useRef)(null);
	const ref = externalRef || localRef;
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)(null);
	const entry = ctx && Object.prototype.hasOwnProperty.call(ctx.overrides || {}, field) ? ctx.overrides[field] : null;
	const safeEntry = entry && typeof entry === "object" && !Array.isArray(entry) && !Object.prototype.hasOwnProperty.call(entry, "order") ? entry : null;
	const defaultContent = children == null ? fallback : children;
	const sourceIsString = typeof defaultContent === "string";
	const overrideBase = safeEntry && typeof safeEntry.base === "string" ? safeEntry.base : null;
	const overrideValue = !(overrideBase != null && sourceIsString && normalizeEditableText(defaultContent, multiline) !== overrideBase) && safeEntry && typeof safeEntry.value === "string" ? safeEntry.value : null;
	const overrideStyle = safeEntry ? toReactStyleObject(safeEntry.style) : null;
	const display = overrideValue != null ? overrideValue : defaultContent;
	const displayString = display == null ? "" : typeof display === "string" ? display : "";
	const composedStyle = overrideStyle ? {
		...styleProp || null,
		...overrideStyle
	} : styleProp || void 0;
	if (!ctx || !ctx.isDev) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className,
		style: composedStyle,
		...rest,
		children: display
	});
	const beginEdit = () => {
		if (editing) return;
		setEditing(true);
		setStatus(null);
		const node = ref && "current" in ref ? ref.current : null;
		if (ctx.setActiveField) ctx.setActiveField(field, node);
		setTimeout(() => {
			const n = ref && "current" in ref ? ref.current : null;
			if (n) placeCaretAtEnd(n);
		}, 0);
	};
	const cancel = () => {
		if (!editing) return;
		const node = ref && "current" in ref ? ref.current : null;
		if (node) node.innerText = displayString;
		setEditing(false);
		setStatus(null);
		if (ctx.clearActiveField) ctx.clearActiveField(field);
		setTimeout(() => {
			if (node) node.focus({ preventScroll: true });
		}, 0);
	};
	const commit = async () => {
		if (!editing) return;
		const node = ref && "current" in ref ? ref.current : null;
		if (!node) return;
		const newValue = normalizeEditableText(node.innerText == null ? node.textContent || "" : node.innerText, multiline);
		const oldValue = displayString;
		if (newValue === oldValue) {
			setEditing(false);
			setStatus(null);
			if (ctx.clearActiveField) ctx.clearActiveField(field);
			return;
		}
		if (!allowEmpty && newValue.length === 0) {
			setStatus("empty");
			placeCaretAtEnd(node);
			return;
		}
		setStatus(null);
		const patch = sourceIsString ? {
			value: newValue,
			base: normalizeEditableText(defaultContent, multiline)
		} : { value: newValue };
		const result = await ctx.save(field, patch);
		setEditing(false);
		if (ctx.clearActiveField) ctx.clearActiveField(field);
		if (!(result && result.ok)) {
			if (node) node.innerText = oldValue;
		}
		setTimeout(() => {
			if (node) node.focus({ preventScroll: true });
		}, 0);
	};
	const handleClick = (event) => {
		if (onClick) onClick(event);
	};
	const handleDoubleClick = (event) => {
		if (onDoubleClick) onDoubleClick(event);
		if (event.defaultPrevented) return;
		event.stopPropagation();
		beginEdit();
	};
	const handleKeyDown = (event) => {
		if (onKeyDown) onKeyDown(event);
		if (event.defaultPrevented) return;
		if (!editing) {
			if (event.key === "F2" || event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				beginEdit();
			}
			return;
		}
		event.stopPropagation();
		if (event.key === "Escape") {
			event.preventDefault();
			cancel();
			return;
		}
		if (event.key === "Enter") {
			if (multiline && event.shiftKey) return;
			if (!multiline && event.shiftKey) {
				event.preventDefault();
				return;
			}
			event.preventDefault();
			commit();
		}
	};
	const handleFocus = (event) => {
		if (onFocus) onFocus(event);
		if (ctx.setActiveField) {
			const node = ref && "current" in ref ? ref.current : null;
			ctx.setActiveField(field, node);
		}
	};
	const handleBlur = (event) => {
		if (onBlur) onBlur(event);
		if (event && event.defaultPrevented) return;
		const next = event && event.relatedTarget;
		if (next && typeof next.closest === "function" && next.closest("[data-deckio-toolbar-root]")) return;
		if (editing) {
			commit();
			return;
		}
		if (ctx.clearActiveField) ctx.clearActiveField(field);
	};
	const composedClassName = [
		className,
		"deckio-editable",
		editing && "deckio-editable--active",
		status === "empty" && "deckio-editable--error"
	].filter(Boolean).join(" ");
	const accessibleLabel = label || `Editable text${field ? `, ${field}` : ""}. Press Enter or F2 to edit, or double-click.`;
	const statusText = status ? STATUS_TEXT[status] || null : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className: composedClassName,
		style: composedStyle,
		"data-deckio-field": field,
		"data-deckio-multiline": multiline ? "true" : void 0,
		"aria-label": accessibleLabel,
		title: editing ? void 0 : "Double-click to edit",
		onClick: handleClick,
		onDoubleClick: handleDoubleClick,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
		...editing ? {
			contentEditable: true,
			suppressContentEditableWarning: true,
			spellCheck: true,
			role: "textbox",
			"aria-multiline": multiline ? "true" : "false"
		} : {
			tabIndex: 0,
			role: "button"
		},
		...rest,
		children: display
	}), statusText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "deckio-editable-status",
		role: "status",
		"aria-live": "assertive",
		children: statusText
	}) : null] });
});
//#endregion
//#region node_modules/@deckio/deck-engine/components/slide-op-client.js
/**
* slide-op-client — browser helper for the dev-only slide-op endpoint.
*
* Resolves the endpoint relative to Vite's BASE_URL (so decks served behind
* the launcher's `/preview/<deckId>/` proxy hit their own middleware) and POSTs
* a `{ op, index, ... }` body. Mirrors Editable.jsx's defaultInlineEditEndpoint.
*/
var SLIDE_OP_ENDPOINT_SUFFIX = "__deckio/slide-op";
/**
* Build the slide-op endpoint URL from a BASE_URL string. Exported for tests.
*/
function resolveSlideOpEndpoint(baseUrl) {
	let base = typeof baseUrl === "string" && baseUrl ? baseUrl : "/";
	if (!base.endsWith("/")) base = `${base}/`;
	return `${base}${SLIDE_OP_ENDPOINT_SUFFIX}`;
}
function defaultSlideOpEndpoint() {
	let base = "/";
	try {
		if (import.meta && import.meta.env && typeof import.meta.env.BASE_URL === "string") base = import.meta.env.BASE_URL || "/";
	} catch {}
	return resolveSlideOpEndpoint(base);
}
/**
* POST a slide operation. Returns { ok, status, data } where data is the parsed
* JSON reply (or null). Never throws on HTTP errors — callers branch on `ok`.
*/
async function callSlideOp(body, endpoint = defaultSlideOpEndpoint()) {
	let res;
	try {
		res = await fetch(endpoint, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body)
		});
	} catch (err) {
		return {
			ok: false,
			status: 0,
			data: null,
			error: "network"
		};
	}
	let data = null;
	try {
		data = await res.json();
	} catch {}
	return {
		ok: res.ok && data?.ok !== false,
		status: res.status,
		data
	};
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/SlideEditTools.jsx
/**
* SlideEditTools — dev-only hide + delete controls for the active slide.
*
* Rendered inside <Navigation>'s export group (top-right, beside the export
* button) so it shares the chrome's reveal-on-mouse-move / hide-on-idle
* behaviour and never overlaps anything. Only renders when inline editing is
* enabled (InlineEditProvider present + isDev) AND the deck is in edit mode —
* inert in production, during presentation, and in fullscreen.
*
* Operations go through the deterministic slide-op endpoint (callSlideOp),
* which edits deck.config.js. That file write lands in the running deck as
* either a full Vite reload or a state-preserving HMR update, so the buttons
* hold a short "busy" lock after a successful op and release it once the deck
* reflects the change (hiddenSlides / slides array updates) — never optimistic.
*
* The buttons take their visual style from the host (Navigation passes its
* export-button classes) so they sit flush in the group. Both are tagged so
* the export/capture pipeline (modern-screenshot, html2canvas, puppeteer)
* skips them.
*/
var IGNORE_ATTRS = {
	"data-deckio-export-ignore": "true",
	"data-html2canvas-ignore": "true"
};
function SlideEditTools({ buttonClassName = "deckio-slide-tools__btn", activeClassName = "is-hidden-slide", dangerClassName = "deckio-slide-tools__btn--danger" }) {
	const slides = useSlides();
	const ie = useInlineEdit();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [pendingReload, setPendingReload] = (0, import_react.useState)(false);
	const [confirmingDelete, setConfirmingDelete] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const confirmTimer = (0, import_react.useRef)(null);
	const releaseTimer = (0, import_react.useRef)(null);
	const preOpRef = (0, import_react.useRef)(null);
	const current = slides?.current ?? 0;
	const totalSlides = slides?.totalSlides ?? 0;
	const hidden = typeof slides?.isHidden === "function" ? slides.isHidden(current) : false;
	(0, import_react.useEffect)(() => () => {
		clearTimeout(confirmTimer.current);
		clearTimeout(releaseTimer.current);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!pendingReload) return;
		const snap = preOpRef.current;
		if (!snap || hidden !== snap.hidden || totalSlides !== snap.totalSlides) {
			clearTimeout(releaseTimer.current);
			preOpRef.current = null;
			setPendingReload(false);
			setBusy(false);
		}
	}, [
		pendingReload,
		hidden,
		totalSlides
	]);
	if (!ie || !ie.isDev) return null;
	if (!slides || slides.mode !== "edit") return null;
	async function runOp(body, label) {
		if (busy) return;
		preOpRef.current = {
			hidden,
			totalSlides
		};
		setBusy(true);
		setError(null);
		const result = await callSlideOp(body);
		if (!result.ok) {
			preOpRef.current = null;
			setBusy(false);
			setError(result.data?.code || `${label} failed`);
			return;
		}
		setPendingReload(true);
		clearTimeout(releaseTimer.current);
		releaseTimer.current = setTimeout(() => {
			preOpRef.current = null;
			setPendingReload(false);
			setBusy(false);
		}, 5e3);
	}
	function toggleHide() {
		runOp({
			op: "hide",
			index: current,
			hidden: !hidden,
			total: totalSlides
		}, "Hide");
	}
	function requestDelete() {
		if (confirmingDelete) {
			clearTimeout(confirmTimer.current);
			setConfirmingDelete(false);
			runOp({
				op: "delete",
				index: current,
				total: totalSlides
			}, "Delete");
			return;
		}
		setConfirmingDelete(true);
		confirmTimer.current = setTimeout(() => setConfirmingDelete(false), 3e3);
	}
	const hideTitle = error ? `Hide failed: ${error}` : hidden ? "Show this slide in presentation" : "Hide this slide from presentation";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `${buttonClassName} ${hidden ? activeClassName : ""}`,
		onClick: toggleHide,
		disabled: busy,
		title: hideTitle,
		"aria-label": hidden ? "Show slide" : "Hide slide",
		...IGNORE_ATTRS,
		children: hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			width: "16",
			height: "16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "1",
				y1: "1",
				x2: "23",
				y2: "23"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			width: "16",
			height: "16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "3"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `${buttonClassName} ${confirmingDelete ? dangerClassName : ""}`,
		onClick: requestDelete,
		disabled: busy,
		title: confirmingDelete ? "Click again to delete this slide" : "Delete this slide",
		"aria-label": confirmingDelete ? "Confirm delete slide" : "Delete slide",
		...IGNORE_ATTRS,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			width: "16",
			height: "16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "3 6 5 6 21 6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 11v6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 11v6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })
			]
		})
	})] });
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/exportDeckService.js
var SETTLE_MS = 600;
var EXPORT_LAYOUTS = Object.freeze([
	{
		id: "widescreen-16-9",
		label: "Widescreen 16:9",
		hint: "PowerPoint default",
		widthIn: 13.333333,
		heightIn: 7.5,
		pixelWidth: 1920,
		pixelHeight: 1080
	},
	{
		id: "standard-4-3",
		label: "Standard 4:3",
		hint: "Classic projector",
		widthIn: 10,
		heightIn: 7.5,
		pixelWidth: 1600,
		pixelHeight: 1200
	},
	{
		id: "a4-landscape",
		label: "A4 landscape",
		hint: "PDF handout",
		widthIn: 11.6929,
		heightIn: 8.2677,
		pixelWidth: 1920,
		pixelHeight: 1358
	},
	{
		id: "letter-landscape",
		label: "Letter landscape",
		hint: "US handout",
		widthIn: 11,
		heightIn: 8.5,
		pixelWidth: 1650,
		pixelHeight: 1275
	}
]);
var EXPORT_QUALITIES = Object.freeze([{
	id: "high",
	label: "High",
	hint: "2x pixels",
	scale: 2
}, {
	id: "standard",
	label: "Standard",
	hint: "smaller file",
	scale: 1
}]);
var EXPORT_FITS = Object.freeze([
	{
		id: "auto",
		label: "Auto fit",
		hint: "shrinks busy slides only"
	},
	{
		id: "1.2",
		label: "120%",
		hint: "zoomed in",
		scale: 1.2
	},
	{
		id: "1",
		label: "100%",
		hint: "source size",
		scale: 1
	},
	{
		id: "0.9",
		label: "90%",
		hint: "slightly tighter",
		scale: .9
	},
	{
		id: "0.8",
		label: "80%",
		hint: "busy slides",
		scale: .8
	}
]);
var DEFAULT_EXPORT_OPTIONS = Object.freeze({
	layout: "widescreen-16-9",
	quality: "high",
	fit: "auto"
});
var AUTO_FIT_SCALES = Object.freeze([
	1,
	.95,
	.9,
	.85,
	.8
]);
var wait = (ms) => new Promise((r) => setTimeout(r, ms));
var TRANSPARENT_RE = /^(transparent|rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/i;
/**
* Pull the first concrete color out of a computed `background-image` gradient.
*
* Gradient-clipped text (`background: linear-gradient(...)` +
* `-webkit-background-clip: text` + transparent fill) is a very common way to
* paint headline text. We reduce it to a solid color for export (see
* `neutralizeClippedText`), so we need a representative color — the first stop
* is the closest single-color approximation.
*
* Returns a CSS color string (e.g. `rgb(99, 102, 241)` or `#6366f1`) or null.
*/
function parseFirstGradientColor(backgroundImage) {
	if (!backgroundImage || backgroundImage === "none") return null;
	const match = backgroundImage.match(/rgba?\([^)]*\)|hsla?\([^)]*\)|#[0-9a-fA-F]{3,8}\b/);
	return match ? match[0] : null;
}
function isClippedText(styles) {
	const clip = styles.webkitBackgroundClip || styles.backgroundClip || "";
	return /text/i.test(clip);
}
/**
* Make gradient-clipped ("text fill") elements export-safe.
*
* Chrome's foreignObject rasterization (used by modern-screenshot) does not
* honor `-webkit-background-clip: text`, so any element painting its glyphs
* with a clipped gradient renders fully transparent — i.e. invisible — in the
* PNG capture. This walks the subtree, and for every clipped-text element
* temporarily replaces the gradient with a solid color (derived from the first
* gradient stop, falling back to the element's own color or a provided
* fallback) so the text actually shows up. Works regardless of class name,
* which matters for hashed CSS-module classes. Returns a restore fn.
*/
function neutralizeClippedText(root, fallbackColor = "#ffffff") {
	if (!root || typeof getComputedStyle !== "function") return () => {};
	const elements = [root, ...root.querySelectorAll("*")];
	const restores = [];
	for (const el of elements) {
		if (!(el instanceof Element)) continue;
		const styles = getComputedStyle(el);
		if (!isClippedText(styles)) continue;
		const ownColor = TRANSPARENT_RE.test(styles.color) ? null : styles.color;
		const color = parseFirstGradientColor(styles.backgroundImage) || ownColor || fallbackColor;
		const style = el.style;
		const prev = {
			backgroundImage: style.backgroundImage,
			webkitBackgroundClip: style.webkitBackgroundClip,
			backgroundClip: style.backgroundClip,
			webkitTextFillColor: style.webkitTextFillColor,
			color: style.color
		};
		restores.push(() => Object.assign(style, prev));
		style.backgroundImage = "none";
		style.webkitBackgroundClip = "border-box";
		style.backgroundClip = "border-box";
		style.webkitTextFillColor = color;
		style.color = color;
	}
	return () => {
		for (let i = restores.length - 1; i >= 0; i--) restores[i]();
	};
}
function byId(items, id, fallbackId) {
	return items.find((item) => item.id === id) || items.find((item) => item.id === fallbackId) || items[0];
}
function resolveExportOptions(options = {}) {
	return {
		layout: byId(EXPORT_LAYOUTS, options.layout, DEFAULT_EXPORT_OPTIONS.layout),
		quality: byId(EXPORT_QUALITIES, options.quality, DEFAULT_EXPORT_OPTIONS.quality),
		fit: byId(EXPORT_FITS, options.fit, DEFAULT_EXPORT_OPTIONS.fit)
	};
}
function getPdfOrientation(layout) {
	return layout.widthIn >= layout.heightIn ? "landscape" : "portrait";
}
function getLayoutPageFormat(layout) {
	return [layout.widthIn, layout.heightIn];
}
function getSlideBackground() {
	return getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#080b10";
}
function normalizeHexColor(value, fallback = "080B10") {
	const raw = String(value || "").trim();
	const short = raw.match(/^#?([0-9a-f]{3})$/i);
	if (short) return short[1].split("").map((c) => c + c).join("").toUpperCase();
	const long = raw.match(/^#?([0-9a-f]{6})$/i);
	return long ? long[1].toUpperCase() : fallback;
}
function sanitizeFilePart(v) {
	return String(v || "deck").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "deck";
}
function buildExportFileName({ project, selectedCustomer, extension }) {
	return `${sanitizeFilePart(selectedCustomer ? `${selectedCustomer} ${document.title || project || "deck"}` : document.title || project || "deck")}.${extension}`;
}
async function waitForPaint() {
	await new Promise((r) => requestAnimationFrame(() => r()));
	await new Promise((r) => requestAnimationFrame(() => r()));
}
async function settleExportFrame() {
	await waitForPaint();
	await wait(SETTLE_MS);
}
async function waitForAssets(root) {
	if (document.fonts?.ready) await document.fonts.ready;
	const images = Array.from(root?.querySelectorAll("img") || []);
	await Promise.all(images.map(async (img) => {
		if (img.complete) return;
		if (typeof img.decode === "function") try {
			await img.decode();
			return;
		} catch {}
		await new Promise((resolve) => {
			const done = () => resolve();
			img.addEventListener("load", done, { once: true });
			img.addEventListener("error", done, { once: true });
		});
	}));
}
async function withExportMode(format, run) {
	const html = document.documentElement;
	const prevMode = html.getAttribute("data-export-mode");
	const prevFormat = html.getAttribute("data-export-format");
	const prevWidth = html.style.getPropertyValue("--deckio-export-width");
	const prevHeight = html.style.getPropertyValue("--deckio-export-height");
	const prevFit = html.style.getPropertyValue("--deckio-export-fit-scale");
	html.setAttribute("data-export-mode", "capture");
	html.setAttribute("data-export-format", format);
	try {
		return await run();
	} finally {
		if (prevMode === null) html.removeAttribute("data-export-mode");
		else html.setAttribute("data-export-mode", prevMode);
		if (prevFormat === null) html.removeAttribute("data-export-format");
		else html.setAttribute("data-export-format", prevFormat);
		restoreCssVar(html, "--deckio-export-width", prevWidth);
		restoreCssVar(html, "--deckio-export-height", prevHeight);
		restoreCssVar(html, "--deckio-export-fit-scale", prevFit);
	}
}
function restoreCssVar(el, name, value) {
	if (value) el.style.setProperty(name, value);
	else el.style.removeProperty(name);
}
function saveInlineStyles(el, props) {
	if (!el) return () => {};
	const previous = props.map((prop) => [prop, el.style[prop]]);
	return () => {
		previous.forEach(([prop, value]) => {
			el.style[prop] = value;
		});
	};
}
function applyStyles(el, styles) {
	if (!el) return;
	Object.assign(el.style, styles);
}
function prepareExportStage(deck, slide, layout) {
	const html = document.documentElement;
	const body = document.body;
	const root = document.getElementById("root");
	const size = {
		width: `${layout.pixelWidth}px`,
		height: `${layout.pixelHeight}px`
	};
	const restores = [
		saveInlineStyles(html, [
			"width",
			"height",
			"overflow"
		]),
		saveInlineStyles(body, [
			"width",
			"height",
			"overflow"
		]),
		saveInlineStyles(root, [
			"width",
			"height",
			"overflow"
		]),
		saveInlineStyles(deck, [
			"width",
			"height",
			"overflow",
			"position"
		]),
		saveInlineStyles(slide, [
			"width",
			"height",
			"position",
			"inset",
			"left",
			"top",
			"opacity",
			"visibility",
			"pointerEvents",
			"transform",
			"transition",
			"maxWidth",
			"maxHeight",
			"boxSizing"
		])
	];
	html.style.setProperty("--deckio-export-width", size.width);
	html.style.setProperty("--deckio-export-height", size.height);
	applyStyles(html, {
		...size,
		overflow: "hidden"
	});
	applyStyles(body, {
		...size,
		overflow: "hidden"
	});
	applyStyles(root, {
		...size,
		overflow: "hidden"
	});
	applyStyles(deck, {
		...size,
		overflow: "hidden",
		position: "relative"
	});
	applyStyles(slide, {
		...size,
		position: "relative",
		inset: "auto",
		left: "0",
		top: "0",
		opacity: "1",
		visibility: "visible",
		pointerEvents: "auto",
		transform: "none",
		transition: "none",
		maxWidth: "none",
		maxHeight: "none",
		boxSizing: "border-box"
	});
	return () => {
		for (let i = restores.length - 1; i >= 0; i--) restores[i]();
	};
}
function isMeasurableSlideChild(child) {
	if (!(child instanceof Element)) return false;
	if (child.matches(".slide-overflow-warn, [data-export-ignore=\"true\"]")) return false;
	const styles = getComputedStyle(child);
	if (styles.display === "none" || styles.visibility === "hidden") return false;
	if (styles.position === "absolute" || styles.position === "fixed") return false;
	return true;
}
function hasSlideOverflow(slide, tolerance = 2) {
	const slideRect = slide.getBoundingClientRect();
	return Array.from(slide.children).some((child) => {
		if (!isMeasurableSlideChild(child)) return false;
		const rect = child.getBoundingClientRect();
		return rect.left < slideRect.left - tolerance || rect.top < slideRect.top - tolerance || rect.right > slideRect.right + tolerance || rect.bottom > slideRect.bottom + tolerance;
	});
}
async function resolveFitScale(slide, fit) {
	if (fit?.id !== "auto") return fit?.scale || 1;
	const html = document.documentElement;
	for (const scale of AUTO_FIT_SCALES) {
		html.style.setProperty("--deckio-export-fit-scale", String(scale));
		await waitForPaint();
		if (!hasSlideOverflow(slide)) return scale;
	}
	return AUTO_FIT_SCALES[AUTO_FIT_SCALES.length - 1];
}
function isInfiniteAnimation(anim) {
	try {
		return anim.effect?.getComputedTiming?.().iterations === Infinity;
	} catch {
		return false;
	}
}
/**
* Freeze a slide's motion into a single clean still for capture.
*
* An export is one frame, but a slide may be captured while transitions and
* animations are still in flight — most notably the disclosure reveal, where a
* just-revealed element is mid-way through a multi-hundred-ms opacity/transform
* transition (e.g. `.deck-steps-step` fades 0.15 → 1 over 0.5s). Freezing such a
* transition at its current frame bakes the half-faded, washed-out look into the
* export. So instead of pausing everything, we **finish** finite animations and
* transitions (snapping them to their final, fully-revealed state) and only
* **pause** infinite, decorative loops (orbs, glows) at their current frame.
*
* This is class-name agnostic: it fixes hand-rolled disclosure slides whose
* reveal classes the export-mode CSS overrides cannot know about.
*/
function pauseAnimations(slide) {
	if (slide && typeof slide.getAnimations === "function") {
		let anims = [];
		try {
			anims = slide.getAnimations({ subtree: true });
		} catch {
			anims = [];
		}
		const paused = [];
		for (const anim of anims) if (isInfiniteAnimation(anim)) try {
			anim.pause();
			paused.push(anim);
		} catch {}
		else try {
			anim.finish();
		} catch {}
		return () => {
			for (const anim of paused) try {
				anim.play();
			} catch {}
		};
	}
	const undo = [];
	const pause = (el) => {
		const orig = el.style.animationPlayState;
		el.style.animationPlayState = "paused";
		undo.push(() => {
			el.style.animationPlayState = orig;
		});
	};
	pause(slide);
	slide.querySelectorAll("*").forEach(pause);
	return () => {
		for (let i = undo.length - 1; i >= 0; i--) undo[i]();
	};
}
var MAX_DISCLOSURE_STEPS = 40;
/**
* Drive a slide's progressive disclosure to its final, fully-revealed state.
*
* Slides built with the engine's `useDisclosure` hook already reveal everything
* during export (they observe `useIsExporting`). But decks may contain
* hand-rolled slides that keep their own step state and only advance on forward
* keys. For those we synthesize forward-key presses (→) until the slide stops
* changing, so the capture shows the final composition rather than step 0.
*
* This is safe because keyboard navigation is suppressed while exporting
* (SlideContext ignores keys when `isExportingNow()`), so an "overshoot" press
* past the last step cannot advance to the next slide — it is simply a no-op,
* which the mutation check below detects to end the loop.
*/
async function revealDisclosureSteps(slide) {
	if (!slide || typeof MutationObserver !== "function" || typeof KeyboardEvent !== "function") return;
	let mutated = false;
	const observer = new MutationObserver(() => {
		mutated = true;
	});
	observer.observe(slide, {
		subtree: true,
		childList: true,
		attributes: true,
		characterData: true
	});
	try {
		for (let i = 0; i < MAX_DISCLOSURE_STEPS; i++) {
			mutated = false;
			(document.activeElement || document.body || document).dispatchEvent(new KeyboardEvent("keydown", {
				key: "ArrowRight",
				code: "ArrowRight",
				bubbles: true,
				cancelable: true,
				composed: true
			}));
			await waitForPaint();
			if (!mutated) break;
		}
	} finally {
		observer.disconnect();
	}
}
async function captureSlidePng({ domToPng, deck, slide, layout, quality, fit, backgroundColor }) {
	const restoreStage = prepareExportStage(deck, slide, layout);
	try {
		await waitForPaint();
		await revealDisclosureSteps(slide);
		const fitScale = await resolveFitScale(slide, fit);
		document.documentElement.style.setProperty("--deckio-export-fit-scale", String(fitScale));
		await waitForPaint();
		await waitForAssets(slide);
		const restoreAnimations = pauseAnimations(slide);
		const restoreClippedText = neutralizeClippedText(slide, "#ffffff");
		try {
			await waitForPaint();
			return await domToPng(slide, {
				width: layout.pixelWidth,
				height: layout.pixelHeight,
				backgroundColor,
				scale: quality.scale,
				filter: (node) => !(node instanceof Element) || node.getAttribute("data-deckio-export-ignore") !== "true",
				style: {
					position: "relative",
					inset: "auto",
					left: "0",
					top: "0",
					width: `${layout.pixelWidth}px`,
					height: `${layout.pixelHeight}px`,
					maxWidth: "none",
					maxHeight: "none",
					boxSizing: "border-box",
					opacity: "1",
					visibility: "visible",
					transform: "none",
					transition: "none"
				}
			});
		} finally {
			restoreClippedText();
			restoreAnimations();
		}
	} finally {
		restoreStage();
	}
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/exportDeckPdf.js
/**
* Export deck slides to PDF - direct download, no dialogs.
*
* Uses modern-screenshot for browser-native rendering and jsPDF with physical
* page units so exported files open at standard slide/paper sizes.
*/
async function exportDeckPdf({ current, goTo, project, selectedCustomer, totalSlides, onProgress, exportOptions }) {
	const deck = document.querySelector(".deck");
	const slides = Array.from(deck?.querySelectorAll(".slide") || []);
	if (!deck || slides.length === 0) throw new Error("No slides found");
	const [{ domToPng }, { jsPDF }] = await Promise.all([import("./dist-3EiKcmRC.js"), import("./jspdf.es.min-D_ZWd10q.js").then((n) => n.t)]);
	const { layout, quality, fit } = resolveExportOptions(exportOptions);
	const bg = getSlideBackground();
	const orientation = getPdfOrientation(layout);
	const pageFormat = getLayoutPageFormat(layout);
	const pdf = new jsPDF({
		orientation,
		unit: "in",
		format: pageFormat,
		compress: true
	});
	await withExportMode("pdf", async () => {
		await settleExportFrame();
		await waitForAssets(deck);
		try {
			for (let i = 0; i < totalSlides; i++) {
				onProgress?.({
					current: i + 1,
					total: totalSlides
				});
				goTo(i);
				await waitForPaint();
				await settleExportFrame();
				const active = document.querySelector(".slide.active") || slides[i];
				if (!active) throw new Error(`Slide ${i + 1} not found`);
				const dataUrl = await captureSlidePng({
					domToPng,
					deck,
					slide: active,
					layout,
					quality,
					fit,
					backgroundColor: bg
				});
				if (i > 0) pdf.addPage(pageFormat, orientation);
				pdf.addImage(dataUrl, "PNG", 0, 0, layout.widthIn, layout.heightIn, void 0, "FAST");
			}
		} finally {
			goTo(current);
			await waitForPaint();
		}
	});
	const blob = pdf.output("blob");
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = buildExportFileName({
		project,
		selectedCustomer,
		extension: "pdf"
	});
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
	return {
		fileName: a.download,
		layout: layout.id
	};
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/exportDeckPptx.js
/**
* Export deck slides to PowerPoint (.pptx) - direct download, no dialogs.
*
* Uses the same shared capture path as PDF, then places each capture
* full-bleed on a standard PptxGenJS layout.
*/
async function exportDeckPptx({ current, goTo, project, selectedCustomer, totalSlides, onProgress, exportOptions }) {
	const deck = document.querySelector(".deck");
	const slides = Array.from(deck?.querySelectorAll(".slide") || []);
	if (!deck || slides.length === 0) throw new Error("No slides found");
	const [{ domToPng }, PptxGenJS] = await Promise.all([import("./dist-3EiKcmRC.js"), import("./pptxgen.es-CKLMYUWV.js")]);
	const Pptx = PptxGenJS.default || PptxGenJS;
	const { layout, quality, fit } = resolveExportOptions(exportOptions);
	const bg = getSlideBackground();
	const pptx = new Pptx();
	pptx.defineLayout({
		name: layout.id,
		width: layout.widthIn,
		height: layout.heightIn
	});
	pptx.layout = layout.id;
	await withExportMode("pptx", async () => {
		await settleExportFrame();
		await waitForAssets(deck);
		try {
			for (let i = 0; i < totalSlides; i++) {
				onProgress?.({
					current: i + 1,
					total: totalSlides
				});
				goTo(i);
				await waitForPaint();
				await settleExportFrame();
				const active = document.querySelector(".slide.active") || slides[i];
				if (!active) throw new Error(`Slide ${i + 1} not found`);
				const dataUrl = await captureSlidePng({
					domToPng,
					deck,
					slide: active,
					layout,
					quality,
					fit,
					backgroundColor: bg
				});
				const slide = pptx.addSlide();
				slide.background = { color: normalizeHexColor(bg) };
				slide.addImage({
					data: dataUrl,
					x: 0,
					y: 0,
					w: layout.widthIn,
					h: layout.heightIn
				});
			}
		} finally {
			goTo(current);
			await waitForPaint();
		}
	});
	const fileName = buildExportFileName({
		project,
		selectedCustomer,
		extension: "pptx"
	});
	await pptx.writeFile({ fileName });
	return {
		fileName,
		layout: layout.id
	};
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/Navigation.jsx
function resolveProp(value, context) {
	return typeof value === "function" ? value(context) : value;
}
var IS_STANDALONE = typeof window === "undefined" ? true : (() => {
	try {
		return window.self === window.top;
	} catch {
		return false;
	}
})();
function toggleFullscreen() {
	try {
		if (document.fullscreenElement) document.exitFullscreen?.();
		else document.documentElement.requestFullscreen?.();
	} catch (error) {
		console.debug("Fullscreen toggle was not allowed", error);
	}
}
function Navigation({ pdfPath = null, pdfLabel = "Deck PDF" }) {
	const { current, totalSlides, go, goTo, selectedCustomer, project, progress, atStart, atEnd, firstVisibleIndex, isFullscreen } = useSlides();
	const [hintVisible, setHintVisible] = (0, import_react.useState)(true);
	const [idle, setIdle] = (0, import_react.useState)(false);
	const [isExporting, setIsExporting] = (0, import_react.useState)(false);
	const [exportStatus, setExportStatus] = (0, import_react.useState)("PDF");
	const [exportMenuOpen, setExportMenuOpen] = (0, import_react.useState)(false);
	const [exportError, setExportError] = (0, import_react.useState)(null);
	const [exportOptions, setExportOptions] = (0, import_react.useState)(DEFAULT_EXPORT_OPTIONS);
	const [navHasFocus, setNavHasFocus] = (0, import_react.useState)(false);
	const exportMenuRef = (0, import_react.useRef)(null);
	const navRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setHintVisible(false), 5e3);
		return () => clearTimeout(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const resetIdle = () => {
			setIdle(false);
			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => setIdle(true), 2e3);
		};
		const handleFocusIn = (e) => {
			if (navRef.current?.contains(e.target)) setNavHasFocus(true);
			resetIdle();
		};
		const handleFocusOut = () => {
			window.setTimeout(() => {
				setNavHasFocus(Boolean(navRef.current?.contains(document.activeElement)));
			}, 0);
		};
		resetIdle();
		window.addEventListener("mousemove", resetIdle);
		window.addEventListener("mousedown", resetIdle);
		window.addEventListener("keydown", resetIdle);
		window.addEventListener("focusin", handleFocusIn);
		window.addEventListener("focusout", handleFocusOut);
		return () => {
			window.removeEventListener("mousemove", resetIdle);
			window.removeEventListener("mousedown", resetIdle);
			window.removeEventListener("keydown", resetIdle);
			window.removeEventListener("focusin", handleFocusIn);
			window.removeEventListener("focusout", handleFocusOut);
			clearTimeout(timerRef.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!exportMenuOpen) return;
		const handleClickOutside = (e) => {
			if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportMenuOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [exportMenuOpen]);
	const progressPercent = typeof progress === "number" ? progress : (current + 1) / totalSlides * 100;
	const navigationState = {
		current,
		totalSlides,
		selectedCustomer,
		project
	};
	const resolvedPdfPath = resolveProp(pdfPath, navigationState);
	const resolvedPdfLabel = resolveProp(pdfLabel, navigationState) || "Deck PDF";
	function updateExportOption(key, value) {
		setExportOptions((prev) => ({
			...prev,
			[key]: value
		}));
	}
	async function handleExport(format) {
		if (isExporting) return;
		setExportMenuOpen(false);
		setIsExporting(true);
		setExportStatus("Preparing");
		const exportFn = format === "pptx" ? exportDeckPptx : exportDeckPdf;
		const label = format === "pptx" ? "PPTX" : "PDF";
		try {
			await exportFn({
				current,
				goTo,
				project,
				selectedCustomer,
				totalSlides,
				onProgress: ({ current: slideNumber, total }) => {
					setExportStatus(`${slideNumber}/${total}`);
				},
				exportOptions
			});
			setExportStatus("Done");
			setExportError(null);
		} catch (error) {
			console.error(`${label} export failed`, error);
			setExportError({
				format,
				message: error?.message || `${label} export failed`
			});
			setExportStatus("PDF");
		} finally {
			window.setTimeout(() => {
				setIsExporting(false);
				setExportStatus("PDF");
			}, 1200);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: navRef,
		className: `${styles.navWrapper} ${idle && !navHasFocus ? styles.navHidden : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: styles.progressTrack,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: styles.progressFill,
					style: { width: `${progressPercent}%` }
				})
			}),
			current !== firstVisibleIndex && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: styles.homeBtn,
				onClick: () => goTo(firstVisibleIndex),
				title: "Back to home",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 12l9-9 9 9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 21V9h6v12" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: styles.exportGroup,
				ref: exportMenuRef,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideEditTools, {
						buttonClassName: styles.exportBtn,
						activeClassName: styles.editToolActive,
						dangerClassName: styles.editToolDanger
					}),
					IS_STANDALONE && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: styles.exportBtn,
						type: "button",
						onClick: toggleFullscreen,
						title: isFullscreen ? "Exit fullscreen" : "Present fullscreen (hides hidden slides)",
						"aria-label": isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
						children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" })
							]
						})
					}),
					resolvedPdfPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: styles.exportBtn,
						href: resolvedPdfPath,
						target: "_blank",
						rel: "noopener noreferrer",
						title: resolvedPdfLabel,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 2 14 8 20 8" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "16",
									y1: "13",
									x2: "8",
									y2: "13"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "16",
									y1: "17",
									x2: "8",
									y2: "17"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "10 9 9 9 8 9" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: styles.exportLabel,
							children: "PDF"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `${styles.exportBtn} ${isExporting ? styles.exportBtnBusy : ""}`,
						type: "button",
						onClick: () => isExporting ? null : setExportMenuOpen(!exportMenuOpen),
						disabled: isExporting,
						title: isExporting ? "Exporting..." : "Export deck",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 2 14 8 20 8" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 12v6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 15l3 3 3-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 10h8" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: styles.exportLabel,
							children: isExporting ? exportStatus : "⬇"
						})]
					}),
					exportError && !resolvedPdfPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: styles.exportError,
						role: "alert",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export failed — " }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleExport(exportError.format),
								disabled: isExporting,
								children: "Retry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: styles.exportErrorDismiss,
								onClick: () => setExportError(null),
								"aria-label": "Dismiss export error",
								children: "×"
							})
						]
					}),
					exportMenuOpen && !isExporting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: styles.exportMenu,
						role: "dialog",
						"aria-label": "Export deck options",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: styles.exportMenuHeader,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: styles.exportMenuTitle,
									children: "Export deck"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: styles.exportMenuHint,
									children: "Widescreen is the PowerPoint default"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: styles.exportField,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Size" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: exportOptions.layout,
									onChange: (event) => updateExportOption("layout", event.target.value),
									children: EXPORT_LAYOUTS.map((layout) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: layout.id,
										children: [
											layout.label,
											" - ",
											layout.hint
										]
									}, layout.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: styles.exportField,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: exportOptions.fit,
									onChange: (event) => updateExportOption("fit", event.target.value),
									children: EXPORT_FITS.map((fit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: fit.id,
										children: [
											fit.label,
											" - ",
											fit.hint
										]
									}, fit.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: styles.exportField,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quality" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: exportOptions.quality,
									onChange: (event) => updateExportOption("quality", event.target.value),
									children: EXPORT_QUALITIES.map((quality) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: quality.id,
										children: [
											quality.label,
											" - ",
											quality.hint
										]
									}, quality.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: styles.exportActions,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: styles.exportMenuItem,
									onClick: () => handleExport("pdf"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										width: "14",
										height: "14",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 2 14 8 20 8" })]
									}), "PDF"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: styles.exportMenuItem,
									onClick: () => handleExport("pptx"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										width: "14",
										height: "14",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: "2",
												y: "3",
												width: "20",
												height: "14",
												rx: "2",
												ry: "2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 21h8" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 17v4" })
										]
									}), "PowerPoint"]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: `${styles.navBtn} ${styles.prev}`,
				disabled: atStart,
				onClick: () => go(-1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "15 18 9 12 15 6" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: `${styles.navBtn} ${styles.next}`,
				disabled: atEnd,
				onClick: () => go(1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "9 6 15 12 9 18" })
				})
			}),
			hintVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: styles.keyHint,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: styles.kbd,
						children: "←"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: styles.kbd,
						children: "→"
					}),
					" or click arrows to navigate"
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/SlideErrorBoundary.jsx
var SlideErrorBoundaryInner = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, errorInfo) {
		console.error("Slide failed to render", error, errorInfo);
	}
	render() {
		const { children, index, stateClass } = this.props;
		const { error } = this.state;
		if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `slide ${stateClass} slide-error-boundary`,
			"data-slide": index,
			role: "alert",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "slide-error-boundary__content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "This slide failed to render" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error.message || "Unknown rendering error" })]
			})
		});
		return children;
	}
};
function SlideErrorBoundary({ children, index }) {
	const { current } = useSlides();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideErrorBoundaryInner, {
		index,
		stateClass: index === current ? "active" : index < current ? "exit-left" : "",
		children
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/BottomBar.jsx
function BottomBar({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: styles$1.bar,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "GitHub Copilot \xA0·\xA0 Reimagine Software Development" }) })
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericThankYouSlide.jsx
function GenericThankYouSlide({ index = 10, subtitle, tagline, footerText }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-ty",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-ty-glow deck-ty-glow1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-ty-glow deck-ty-glow2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-ty-glow deck-ty-glow3" }),
			[
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `deck-ty-streak deck-ty-streak${i}` }, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-ty-shell content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-ty-content",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
							as: "h2",
							id: "thankYou.title",
							className: "deck-ty-title",
							children: "Thank You"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
							as: "p",
							id: "thankYou.subtitle",
							className: "deck-ty-subtitle",
							children: subtitle || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Let’s build something great — together." })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-ty-divider" }),
						tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
							as: "p",
							id: "thankYou.tagline",
							className: "deck-ty-tagline",
							children: tagline
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-ty-watermark",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/deckio.png",
						alt: "",
						className: "deck-ty-watermark-icon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "deck-ty-watermark-text",
						children: "DECKIO"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
				as: "span",
				id: "thankYou.footer",
				children: footerText
			}) })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/sampleContent.js
function markSampleContent(value, meta = {}) {
	return Object.assign(value, {
		__sample: true,
		__sampleSource: "@deckio/deck-engine",
		__samplePolicy: "visual-only-not-user-context",
		...meta
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericTwoOptionsSlide.jsx
/**
* Two Options — side-by-side comparison with "or" divider.
*
* Props:
*   eyebrow     – small label above the title (default: "Two paths")
*   title       – main heading, supports JSX (default: "Two <highlight>Options</highlight>")
*   options     – array of 2 objects: { num, badge, title, description, items[], tags[] }
*   footerText  – bottom bar text
*
* 🤖 Prompt tips:
*   "In agent mode, turn this slide into Kubernetes vs Container Apps"
*   "Rewrite both option cards using our real trade-offs and presenter-friendly wording"
*   "Inspect this slide, tell me what looks off, and refine the comparison"
*/
var SAMPLE_OPTIONS = markSampleContent([{
	id: "option-a",
	num: "01",
	badge: "Option A",
	title: "Describe Option A To Copilot",
	description: "Use this card for your first real path, architecture, strategy, or trade-off, then let Copilot turn it into presenter-ready copy.",
	items: [
		"Ask Copilot in agent mode to define Option A",
		"Give it outcomes, risks, and constraints",
		"Review the live slide and refine the wording"
	],
	tags: [
		"🤖 Agent mode",
		"🅰️ Option A",
		"🔁 Refine live"
	]
}, {
	id: "option-b",
	num: "02",
	badge: "Option B",
	title: "Ask For The Contrast In Option B",
	description: "Use this card for the second path so Copilot can turn the slide into a real comparison instead of two isolated lists.",
	items: [
		"Tell Copilot what changes in Option B",
		"Ask it to sharpen the difference vs Option A",
		"Delete the sample text once the slide is real"
	],
	tags: [
		"🤖 Copilot draft",
		"🅱️ Option B",
		"🧪 Inspect result"
	]
}], { kind: "comparison-options" });
function GenericTwoOptionsSlide({ index = 0, eyebrow = "Sample slide · build with Copilot", title, options = SAMPLE_OPTIONS, footerText }) {
	const isSampleOptions = options?.__sample === true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-two-options",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-two-options-orb1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-two-options-orb2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-two-options-body content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-two-options-header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-two-options-eyebrow",
							children: eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "deck-two-options-title",
							children: title || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Ask Copilot To Build Your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "deck-two-options-highlight",
								children: "Real Comparison"
							})] })
						}),
						isSampleOptions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-two-options-sample-note",
							children: "Recommended flow: ask Copilot in agent mode to rewrite both cards with your real options, inspect the slide in the live preview, refine anything that feels off, then remove the sample text before using this deck as context."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-two-options-columns",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
						id: "twoOptions.options",
						items: options,
						keyOf: (o) => o.id,
						as: "div",
						itemAs: "div",
						className: "deck-two-options-cards",
						children: (opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `deck-two-options-card deck-two-options-card${i + 1}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-two-options-card-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deck-two-options-card-inner",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "deck-two-options-card-top",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-two-options-big-num",
											children: opt.num
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-two-options-badge",
											"data-variant": i === 0 ? "a" : "b",
											children: opt.badge
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "deck-two-options-card-title",
										children: opt.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "deck-two-options-card-desc",
										children: opt.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-two-options-divider" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "deck-two-options-items",
										children: opt.items?.map((item, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "deck-two-options-item",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "deck-two-options-item-icon",
												children: "◆"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
										}, j))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "deck-two-options-tags",
										children: opt.tags?.map((tag, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-two-options-tag",
											children: tag
										}, j))
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "deck-two-options-vs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-two-options-vs-line" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "deck-two-options-vs-text",
								children: "or"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-two-options-vs-line" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericStepsSlide.jsx
/**
* Steps — progressive disclosure timeline. Steps reveal one at a time
* via arrow keys when the slide is active.
*
* Props:
*   eyebrow     – small label above title (default: "The playbook")
*   title       – heading (default: "A Proven Framework")
*   subtitle    – under the title
*   steps       – array of { num, title, desc, icon }
*   footerText  – bottom bar text
*
* 🤖 Prompt tips:
*   "Change the steps slide to show our 4-phase migration plan"
*   "Add a 6th step about monitoring and observability"
*   "Make the icons reflect a deployment pipeline"
*/
var SAMPLE_STEPS = markSampleContent([
	{
		id: "step-01",
		num: "01",
		title: "Define the Problem",
		desc: "Identify the core challenge, constraints, and success criteria before writing a single line of code.",
		icon: "🎯"
	},
	{
		id: "step-02",
		num: "02",
		title: "Design the Approach",
		desc: "Map the architecture, choose the right tools, and validate assumptions with the team.",
		icon: "🧠"
	},
	{
		id: "step-03",
		num: "03",
		title: "Build Iteratively",
		desc: "Ship small increments, get feedback early, and let the code evolve with real-world usage.",
		icon: "🔨"
	},
	{
		id: "step-04",
		num: "04",
		title: "Test & Validate",
		desc: "Automate the boring stuff. Integration tests, load tests, and chaos engineering — trust but verify.",
		icon: "🧪"
	},
	{
		id: "step-05",
		num: "05",
		title: "Ship & Observe",
		desc: "Deploy with confidence. Monitor, alert, iterate. The best code is the code that runs in production.",
		icon: "🚀"
	}
], { kind: "step-sequence" });
function GenericStepsSlide({ index = 0, eyebrow = "The playbook", title = "A Proven Framework", subtitle = "Five steps to ship software that actually moves the needle.", steps = SAMPLE_STEPS, footerText }) {
	const { step: effectiveVisible, setStep: setVisibleCount } = useDisclosure(steps.length, { index });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-steps",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-steps-orb1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-steps-orb2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-steps-body content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-steps-header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-steps-eyebrow",
							children: eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "deck-steps-title",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-steps-subtitle",
							children: subtitle
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "deck-steps-timeline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
						id: "steps.list",
						items: steps,
						keyOf: (s) => s.id,
						as: "div",
						itemAs: "div",
						className: "deck-steps-list",
						onReorder: () => setVisibleCount(0),
						children: (step, i, ordered) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `deck-steps-step ${i < effectiveVisible ? "deck-steps-visible" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deck-steps-connector",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-steps-dot" }), i < ordered.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-steps-line" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deck-steps-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "deck-steps-card-top",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-steps-num",
											children: step.num
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-steps-icon",
											children: step.icon
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "deck-steps-card-title",
										children: step.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "deck-steps-card-desc",
										children: step.desc
									})
								]
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericAgendaSlide.jsx
/**
* Agenda — timeline-style agenda with time blocks, parallel tracks,
* speaker avatars, and optional logo/branding corner.
*
* Props:
*   eyebrow     – small label (default: "Event agenda")
*   title       – heading, supports JSX
*   description – subtitle text
*   blocks      – array of { time, end, label, sub?, icon, color, parallel?, tracks?: [] }
*   footerText  – bottom bar text
*
* 🤖 Prompt tips:
*   "Change the agenda to a 3-hour workshop with 4 sessions"
*   "Add a lunch break at 12:30 and a keynote at 14:00"
*   "Replace the parallel tracks with two workshop rooms"
*/
var SAMPLE_BLOCKS = markSampleContent([
	{
		id: "welcome",
		time: "09:00",
		end: "09:15",
		label: "Welcome & Introduction",
		icon: "🎙",
		color: "accent"
	},
	{
		id: "keynote",
		time: "09:15",
		end: "09:45",
		label: "Opening Keynote",
		sub: "Your amazing speaker here",
		icon: "🎤",
		color: "blue"
	},
	{
		id: "break-am",
		time: "09:45",
		end: "10:00",
		label: "Break",
		icon: "☕",
		color: "muted"
	},
	{
		id: "breakouts",
		time: "10:00",
		end: "12:00",
		label: "Breakout Sessions",
		icon: "💻",
		color: "purple",
		parallel: true,
		tracks: [
			{
				name: "Track A: Building",
				emoji: "🔨",
				desc: "Hands-on coding and architecture"
			},
			{
				name: "Track B: Designing",
				emoji: "🎨",
				desc: "UX, product design, and prototyping"
			},
			{
				name: "Track C: Scaling",
				emoji: "🚀",
				desc: "Infrastructure, DevOps, and platform engineering"
			}
		]
	},
	{
		id: "lunch",
		time: "12:00",
		end: "13:00",
		label: "Lunch & Networking",
		icon: "🍕",
		color: "green"
	}
], { kind: "agenda-blocks" });
function GenericAgendaSlide({ index = 0, eyebrow = "Event agenda", title, description = "Keynotes, hands-on breakouts, and time to connect.", blocks = SAMPLE_BLOCKS, footerText }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-agenda",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-agenda-orb1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-agenda-orb2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-agenda-body content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-agenda-header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-agenda-eyebrow",
							children: eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "deck-agenda-title",
							children: title || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["The ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "deck-agenda-highlight",
								children: "Agenda"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "deck-agenda-desc",
							children: description
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-agenda-timeline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-agenda-rail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
						id: "agenda.blocks",
						items: blocks,
						keyOf: (b) => b.id,
						as: "div",
						itemAs: "div",
						className: "deck-agenda-blocks",
						itemClassName: "",
						children: (block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `deck-agenda-block deck-agenda-${block.color || "accent"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "deck-agenda-time",
									children: block.time
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-agenda-dot" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "deck-agenda-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "deck-agenda-card-header",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "deck-agenda-icon",
													children: block.icon
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "deck-agenda-label",
													children: block.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "deck-agenda-range",
													children: [
														block.time,
														" – ",
														block.end
													]
												})
											]
										}),
										block.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "deck-agenda-sub",
											children: block.sub
										}),
										block.parallel && block.tracks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "deck-agenda-tracks",
											children: block.tracks.map((t, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "deck-agenda-track",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "deck-agenda-track-emoji",
													children: t.emoji
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "deck-agenda-track-info",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "deck-agenda-track-name",
														children: t.name
													}), t.desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "deck-agenda-track-desc",
														children: t.desc
													})]
												})]
											}, j))
										})
									]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericObjectiveSlide.jsx
/**
* Objective — hero statement with KPI counters and feature cards.
*
* Props:
*   label       – small label (default: "Our Objective")
*   heading     – main statement
*   kpis        – array of { number, label }
*   cards       – array of { icon, title, description }
*   banner      – optional bottom banner { icon, title, description }
*   footerText  – bottom bar text
*
* 🤖 Prompt tips:
*   "Change the objective to launching our new API platform"
*   "Update the KPIs to show 50 customers, 5 regions, 99.9% uptime"
*   "Add a card about developer experience"
*/
var SAMPLE_KPIS = markSampleContent([
	{
		id: "kpi-speed",
		number: "10x",
		label: "Faster Deploys"
	},
	{
		id: "kpi-uptime",
		number: "99.9%",
		label: "Uptime SLA"
	},
	{
		id: "kpi-team",
		number: "500+",
		label: "Engineers"
	}
], { kind: "objective-kpis" });
var SAMPLE_CARDS = markSampleContent([
	{
		id: "card-ship",
		icon: "🚀",
		title: "Ship Faster",
		description: "Automate the pipeline from commit to production. Less ceremony, more shipping."
	},
	{
		id: "card-build",
		icon: "🏗️",
		title: "Build to Last",
		description: "Architecture decisions that scale. Design for the traffic you want, not the traffic you have."
	},
	{
		id: "card-grow",
		icon: "🤝",
		title: "Grow the Team",
		description: "Invest in people. Pair programming, code reviews, and a culture where everyone levels up."
	}
], { kind: "objective-cards" });
function GenericObjectiveSlide({ index = 0, label = "Our Objective", heading = "Build the platform developers actually want to use", kpis = SAMPLE_KPIS, cards = SAMPLE_CARDS, banner, footerText }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-objective",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-objective-orb1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-objective-orb2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-objective-body content-frame content-gutter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "deck-objective-label",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "deck-objective-heading",
						children: heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "deck-objective-kpis",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
							id: "objective.kpis",
							items: kpis,
							keyOf: (k) => k.id,
							as: "div",
							itemAs: "div",
							className: "deck-objective-kpis-list",
							children: (kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deck-objective-kpi",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "deck-objective-kpi-number",
									children: kpi.number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "deck-objective-kpi-label",
									children: kpi.label
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "deck-objective-cards",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
							id: "objective.cards",
							items: cards,
							keyOf: (c) => c.id,
							as: "div",
							itemAs: "div",
							className: "deck-objective-cards-list",
							children: (card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deck-objective-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "deck-objective-card-icon",
										children: card.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: card.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: card.description })
								]
							})
						})
					}),
					banner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "deck-objective-banner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "deck-objective-banner-icon",
							children: banner.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: banner.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: banner.description })] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericTocSlide.jsx
/**
* Table of Contents — clickable agenda with numbered items
* that navigate to specific slides.
*
* Props:
*   heading     – left panel text (default: "Table of Contents")
*   items       – array of { num, title, desc, target } where target is slide index
*   footerText  – bottom bar text
*
* 🤖 Prompt tips:
*   "Change the table of contents to have 7 sections for our product launch"
*   "Update the descriptions to match our quarterly review agenda"
*   "Make item 3 point to slide 8 instead"
*/
var SAMPLE_TOC_ITEMS = markSampleContent([
	{
		id: "toc-problem",
		num: 1,
		title: "The Problem",
		desc: "What we are solving and why it matters to the business.",
		target: 2
	},
	{
		id: "toc-approach",
		num: 2,
		title: "Our Approach",
		desc: "The architecture, trade-offs, and key design decisions.",
		target: 3
	},
	{
		id: "toc-demo",
		num: 3,
		title: "Demo",
		desc: "A live walkthrough of the working prototype.",
		target: 4
	},
	{
		id: "toc-roadmap",
		num: 4,
		title: "Roadmap",
		desc: "What is shipping next and the timeline to GA.",
		target: 5
	},
	{
		id: "toc-ask",
		num: 5,
		title: "Ask",
		desc: "What we need from leadership to keep momentum.",
		target: 6
	}
], { kind: "toc-items" });
function GenericTocSlide({ index = 0, heading, items = SAMPLE_TOC_ITEMS, footerText }) {
	const { goTo } = useSlides();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-toc",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-toc-layout content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-toc-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-toc-orbA" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-toc-orbB" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "deck-toc-circuit",
							viewBox: "0 0 120 120",
							fill: "none",
							stroke: "rgba(139,148,158,0.5)",
							strokeWidth: "1.2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10,60 H50 Q60,60 60,50 V20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M60,20 Q60,10 70,10 H110" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "10",
									cy: "60",
									r: "3",
									fill: "rgba(86,212,221,0.6)",
									stroke: "none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "110",
									cy: "10",
									r: "3",
									fill: "rgba(188,140,255,0.6)",
									stroke: "none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M50,60 Q60,60 60,70 V100" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "60",
									cy: "100",
									r: "3",
									fill: "rgba(88,166,255,0.6)",
									stroke: "none"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "deck-toc-heading",
							children: heading || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Table ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "deck-toc-muted",
									children: "of"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Contents"
							] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "deck-toc-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "deck-toc-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
							id: "toc.entries",
							items,
							keyOf: (it) => it.id,
							as: "div",
							itemAs: "div",
							className: "deck-toc-list",
							children: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "deck-toc-item",
								onClick: () => item.target != null && goTo(item.target),
								disabled: item.target == null,
								"aria-label": `Go to slide ${item.num}: ${item.title}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "deck-toc-num",
									children: item.num
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "deck-toc-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.desc })]
								})]
							})
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/slides/GenericGoalsSlide.jsx
/**
* Three Goals — triple card layout with icons and accent colors.
*
* Props:
*   title       – heading (default: "Three clear goals")
*   subtitle    – under the title
*   goals       – array of 3: { title, description, icon (JSX or emoji string), accent }
*   footerText  – bottom bar text
*
* Accent values: 'accent' (teal), 'purple', 'green', 'pink', 'blue', 'orange'
*
* 🤖 Prompt tips:
*   "Change the goals to reflect our Q3 OKRs"
*   "Use company-specific icons and pink/purple/green accents"
*   "Add a fourth goal about customer satisfaction"
*/
var SAMPLE_GOALS = markSampleContent([
	{
		id: "goal-ship",
		title: "Ship with Confidence",
		description: "Every commit is tested, every deploy is automated. Move fast without breaking things.",
		icon: "⚡",
		accent: "accent"
	},
	{
		id: "goal-measure",
		title: "Measure What Matters",
		description: "Track the metrics that drive business outcomes, not vanity stats.",
		icon: "📊",
		accent: "purple"
	},
	{
		id: "goal-grow",
		title: "Grow the Community",
		description: "Open source first. Documentation as a feature. Make it easy for others to contribute.",
		icon: "🌍",
		accent: "green"
	}
], { kind: "goals" });
function GenericGoalsSlide({ index = 0, title = "Three clear goals", subtitle = "What success looks like for this initiative", goals = SAMPLE_GOALS, footerText }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slide, {
		index,
		className: "deck-goals",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "accent-bar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-goals-orb1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-goals-orb2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "orb deck-goals-orb3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "deck-goals-body content-frame content-gutter",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deck-goals-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "deck-goals-title",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "deck-goals-subtitle",
						children: subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "deck-goals-cards",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableList, {
						id: "goals.items",
						items: goals,
						keyOf: (g) => g.id,
						as: "div",
						itemAs: "div",
						className: "deck-goals-list",
						children: (g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `deck-goals-card deck-goals-card-${g.accent || "accent"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "deck-goals-card-glow" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "deck-goals-card-icon",
									children: typeof g.icon === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { fontSize: 36 },
										children: g.icon
									}) : g.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "deck-goals-card-title",
									children: g.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "deck-goals-card-desc",
									children: g.description
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomBar, { text: footerText })
		]
	});
}
//#endregion
export { BottomBar, Editable, EditableList, EditableProvider, EditableToolbar, GenericAgendaSlide, GenericGoalsSlide, GenericObjectiveSlide, GenericStepsSlide, GenericThankYouSlide, GenericTocSlide, GenericTwoOptionsSlide, InlineEditProvider, Navigation, Slide, SlideEditTools, SlideErrorBoundary, SlideProvider, callSlideOp, defaultSlideOpEndpoint, isExportingNow, resolveSlideOpEndpoint, useDisclosure, useEditable, useEditableValue, useInlineEdit, useInlineEditEntry, useInlineEditValue, useIsExporting, useOrderedItems, useSlides };
