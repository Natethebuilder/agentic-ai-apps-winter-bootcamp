import { i as __toESM } from "./rolldown-runtime-B-lAHAz2.js";
import { t as require_react } from "./react.js";
import { t as require_react_dom } from "./react-dom.js";
import { t as require_jsx_runtime } from "./react_jsx-runtime.js";
import styles from "C:/Users/t-nathanb/.copilot/repos/copilot-worktrees/agentic-ai-apps-winter-bootcamp/natethebuilder-effective-fortnight/node_modules/@deckio/deck-engine/components/GitHubStarPrompt.module.css";
//#region node_modules/@deckio/deck-engine/components/star-prompt-store.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_react_dom = require_react_dom();
/**
* Throttled "star us on GitHub" prompt state for the engine's local-dev
* authoring experience.
*
* Pure + storage-injectable so it unit-tests under the node environment without
* a DOM. The component (GitHubStarPrompt.jsx) is a thin wrapper; all of the
* "is it tasteful to ask right now?" policy lives here.
*
* Policy (industry-standard, deliberately non-spammy):
*   - Never on first run. Only after `minSessions` distinct dev sessions, so we
*     ask authors who have actually been building decks.
*   - At most one decision per browser session (cached in sessionStorage), so
*     HMR reloads / re-renders can't re-roll or flicker the prompt.
*   - Showing it once quiets it for `shownCooldownMs` even if simply ignored.
*   - "Maybe later" snoozes for `snoozeMs`. "Star" / "Don't show again" suppress
*     it permanently.
*   - A `probability` gate makes the ask feel organic rather than mechanical.
*   - Every storage access is guarded; on any error we fail closed (never show)
*     so a locked-down browser is never nagged or broken.
*/
var STORAGE_KEY = "deck:star-prompt";
var SESSION_DECISION_KEY = "deck:star-prompt:session";
var DAY = 864e5;
var DEFAULTS = {
	minSessions: 3,
	snoozeMs: 30 * DAY,
	shownCooldownMs: 14 * DAY,
	probability: .5
};
function emptyState() {
	return {
		v: 1,
		status: "idle",
		sessions: 0,
		firstSeenAt: 0,
		lastShownAt: 0,
		snoozeUntil: 0
	};
}
function readState(storage) {
	try {
		const raw = storage && storage.getItem("deck:star-prompt");
		if (!raw) return emptyState();
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return emptyState();
		return {
			...emptyState(),
			...parsed
		};
	} catch {
		return emptyState();
	}
}
function writeState(storage, state) {
	try {
		storage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
	return state;
}
/**
* Pure predicate: given persisted state, should we show the prompt now?
* `opts.random` (defaults to Math.random) is injectable for deterministic tests.
*/
function shouldShow(state, now = Date.now(), opts = {}) {
	const o = {
		...DEFAULTS,
		...opts
	};
	if (!state || state.status !== "idle") return false;
	if ((state.sessions || 0) < o.minSessions) return false;
	if (now < (state.snoozeUntil || 0)) return false;
	return (typeof o.random === "function" ? o.random() : Math.random()) < o.probability;
}
/**
* Decide once per browser session whether to show the prompt, counting the
* session toward engagement on first evaluation. Stable across re-renders /
* HMR reloads within the same session (cached in sessionStorage).
*/
function evaluateForSession(localStore, sessionStore, now = Date.now(), opts = {}) {
	let cached = null;
	try {
		cached = sessionStore.getItem(SESSION_DECISION_KEY);
	} catch {}
	if (cached === "1" || cached === "0") return cached === "1";
	const prev = readState(localStore);
	const counted = {
		...prev,
		sessions: (prev.sessions || 0) + 1,
		firstSeenAt: prev.firstSeenAt || now
	};
	writeState(localStore, counted);
	const show = shouldShow(counted, now, opts);
	try {
		sessionStore.setItem(SESSION_DECISION_KEY, show ? "1" : "0");
	} catch {}
	return show;
}
/** Record that the prompt was shown — quiets it for a cooldown even if ignored. */
function markShown(storage, now = Date.now(), opts = {}) {
	const o = {
		...DEFAULTS,
		...opts
	};
	const state = readState(storage);
	return writeState(storage, {
		...state,
		lastShownAt: now,
		snoozeUntil: Math.max(state.snoozeUntil || 0, now + o.shownCooldownMs)
	});
}
/** User starred the repo — never ask again. */
function markStarred(storage, now = Date.now()) {
	return writeState(storage, {
		...readState(storage),
		status: "starred",
		lastShownAt: now
	});
}
/** "Maybe later" — snooze for a while, then we may ask once more. */
function markSnoozed(storage, now = Date.now(), opts = {}) {
	const o = {
		...DEFAULTS,
		...opts
	};
	return writeState(storage, {
		...readState(storage),
		snoozeUntil: now + o.snoozeMs,
		lastShownAt: now
	});
}
/** "Don't show again" — never ask again. */
function markDismissed(storage, now = Date.now()) {
	return writeState(storage, {
		...readState(storage),
		status: "dismissed",
		lastShownAt: now
	});
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/GitHubStarPrompt.jsx
var import_jsx_runtime = require_jsx_runtime();
var REPO_URL = "https://github.com/deckio-art/deck-engine";
function getStorage(name) {
	try {
		return window[name] || null;
	} catch {
		return null;
	}
}
/**
* Are we in a context where it's appropriate to nudge a local author?
*
* Strictly gated so the prompt can NEVER leak into a built, presented, or
* exported deck:
*   - `editMode` — only while authoring (never in present/fullscreen).
*   - `import.meta.env.DEV` — only on the vite dev server, never in a build.
*   - top window only — inside the DECKIO workspace iframe the launcher shows
*     its own prompt, so we suppress here to avoid double-asking.
*   - never while a PDF/PPTX capture is running (`data-export-mode="capture"`).
*/
function isAuthoringContext(editMode) {
	if (!editMode) return false;
	let dev = false;
	try {
		dev = Boolean(import.meta && import.meta.env && import.meta.env.DEV);
	} catch {
		dev = false;
	}
	if (!dev) return false;
	if (typeof window === "undefined" || typeof document === "undefined") return false;
	try {
		if (window.top !== window.self) return false;
	} catch {
		return false;
	}
	try {
		if (document.documentElement.getAttribute("data-export-mode") === "capture") return false;
	} catch {}
	return true;
}
/**
* A small, dismissable corner card inviting engaged local authors to star the
* deck-engine repo. Auto-mounted by SlideProvider so offline npm-package users
* see it without changing their deck — but only while editing on the dev
* server. Non-modal, throttled, persisted (see star-prompt-store.js).
*/
function GitHubStarPrompt({ editMode = false }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const cardRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!isAuthoringContext(editMode)) return;
		const local = getStorage("localStorage");
		const session = getStorage("sessionStorage");
		if (!local || !session) return;
		if (evaluateForSession(local, session)) {
			markShown(local);
			setVisible(true);
		}
	}, [editMode]);
	(0, import_react.useEffect)(() => {
		if (!visible) return;
		cardRef.current?.focus();
		const onKey = (e) => {
			if (e.key === "Escape") snooze();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [visible]);
	if (!visible || typeof document === "undefined") return null;
	const snooze = () => {
		const local = getStorage("localStorage");
		if (local) markSnoozed(local);
		setVisible(false);
	};
	const star = () => {
		const local = getStorage("localStorage");
		if (local) markStarred(local);
		try {
			window.open(REPO_URL, "_blank", "noopener,noreferrer");
		} catch {}
		setVisible(false);
	};
	const never = () => {
		const local = getStorage("localStorage");
		if (local) markDismissed(local);
		setVisible(false);
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: cardRef,
		className: styles.root,
		role: "dialog",
		"aria-label": "Support DeckIO on GitHub",
		tabIndex: -1,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: styles.close,
				onClick: snooze,
				"aria-label": "Dismiss",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseIcon, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: styles.body,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: styles.icon,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarIcon, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: styles.text,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: styles.title,
						children: "Enjoying DeckIO?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: styles.sub,
						children: [
							"Give ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: styles.repo,
								children: "deck-engine"
							}),
							" a star on GitHub to support the project."
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: styles.actions,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: styles.primary,
					onClick: star,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarIcon, { small: true }), "Star on GitHub"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: styles.secondary,
					onClick: snooze,
					children: "Maybe later"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: styles.never,
				onClick: never,
				children: "Don’t show again"
			})
		]
	}), document.body);
}
function StarIcon({ small = false }) {
	const s = small ? 14 : 18;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: s,
		height: s,
		viewBox: "0 0 24 24",
		fill: "currentColor",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" })
	});
}
function CloseIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "15",
		height: "15",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6L6 18M6 6l12 12" })
	});
}
//#endregion
export { GitHubStarPrompt as default };
