import { i as __toESM } from "./rolldown-runtime-B-lAHAz2.js";
import { t as require_react } from "./react.js";
import { t as require_jsx_runtime } from "./react_jsx-runtime.js";
//#region node_modules/@deckio/deck-engine/components/editable-context.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var InlineEditContext = (0, import_react.createContext)(null);
//#endregion
//#region node_modules/@deckio/deck-engine/components/applyOrder.js
/**
* applyOrder — client-side mirror of the server's applyOrder helper.
*
* Pure. Returns items in (savedOrder ∩ source) order, then appends new
* source items not present in savedOrder in source order. Stale IDs are
* silently dropped. Duplicate IDs in savedOrder are deduped (first wins).
* Items with no/invalid id are appended in source order so an
* ID-shape regression never blanks the slide.
*
* This MUST match `applyOrder` in
* `packages/deck-engine/server/inline-edit-server.mjs`. Both copies are
* pure and have explicit test coverage; if you change one, change both
* and re-run the tests.
*/
function applyOrder(savedOrder, sourceItems, getId) {
	if (!Array.isArray(sourceItems) || sourceItems.length === 0) return [];
	if (typeof getId !== "function") return sourceItems.slice();
	if (!Array.isArray(savedOrder) || savedOrder.length === 0) return sourceItems.slice();
	const byId = /* @__PURE__ */ new Map();
	const noId = [];
	for (let i = 0; i < sourceItems.length; i++) {
		const item = sourceItems[i];
		let id;
		try {
			id = getId(item, i);
		} catch {
			id = null;
		}
		if (typeof id !== "string" || !id) {
			noId.push(item);
			continue;
		}
		if (!byId.has(id)) byId.set(id, item);
	}
	const out = [];
	const used = /* @__PURE__ */ new Set();
	for (const id of savedOrder) {
		if (typeof id !== "string" || !id) continue;
		if (used.has(id)) continue;
		if (!byId.has(id)) continue;
		out.push(byId.get(id));
		used.add(id);
	}
	for (let i = 0; i < sourceItems.length; i++) {
		const item = sourceItems[i];
		let id;
		try {
			id = getId(item, i);
		} catch {
			id = null;
		}
		if (typeof id === "string" && id && !used.has(id) && byId.get(id) === item) {
			out.push(item);
			used.add(id);
		}
	}
	for (const item of noId) out.push(item);
	return out;
}
//#endregion
//#region node_modules/@deckio/deck-engine/components/EditableList.jsx
/**
* EditableList — prod-safe shell for a reorderable list of items.
*
* Design (Decision 64):
*   - In PRODUCTION (or with no provider / provider disabled), this renders
*     the items in `applyOrder(savedOrder, items, keyOf)` order with ZERO
*     dnd-kit code reachable. The sortable variant is loaded behind a
*     `React.lazy()` import that lives inside a `ctx.isDev` branch, so
*     Rollup splits @dnd-kit into a separate chunk that prod never asks
*     for.
*   - In DEV (provider active), we render the lazy-loaded sortable
*     variant. The prod shell remains the Suspense fallback so the deck
*     never blanks while @dnd-kit downloads.
*
* API:
*   <EditableList id="agenda.blocks" items={blocks} keyOf={(b) => b.id}>
*     {(block, i) => <AgendaBlock {...block} />}
*   </EditableList>
*
*   - `id` (string, required): the override field id for the list order.
*     Must follow the same field-id rules as <Editable id="...">.
*   - `items` (array): source items in their default order.
*   - `keyOf` (fn, required): returns a stable id per item. If it returns
*     null/undefined for ANY item, reorder is disabled and a dev-only
*     warning is logged. The list still renders in source order.
*   - `children` (fn): render prop `(item, index, ordered) => ReactNode`.
*   - `as` (string|component, default `'div'`): wrapper element.
*   - `itemAs` (string|component, default `'div'`): wrapper for each item.
*   - `onReorder` (optional fn): callback fired after a successful drag
*     reorder with the new id array. Mostly for tests / instrumentation.
*
* Visibility-of-state contract:
*   The prod shell never emits drag-handle JSX, never imports dnd-kit, and
*   never reads from `ctx.activeField`. The sortable variant owns those.
*
* Edit/drag coordination (handled in EditableListSortable):
*   If any field in the list is currently in edit mode, drag-start
*   commits that edit first. If commit fails, the drag is canceled.
*/
var import_jsx_runtime = require_jsx_runtime();
var LazyEditableListSortable = (0, import_react.lazy)(() => import("./EditableListSortable-CwprxICj.js"));
function readOrderEntry(entry) {
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
	if (!Object.prototype.hasOwnProperty.call(entry, "order")) return null;
	if (!Array.isArray(entry.order)) return null;
	for (const id of entry.order) if (typeof id !== "string" || !id) return null;
	return entry.order;
}
function validateKeyOf(items, keyOf) {
	if (typeof keyOf !== "function") return {
		ok: false,
		reason: "no-keyOf"
	};
	const seen = /* @__PURE__ */ new Set();
	for (let i = 0; i < items.length; i++) {
		const k = keyOf(items[i], i);
		if (k == null || k === "") return {
			ok: false,
			reason: "missing-id",
			index: i
		};
		if (typeof k !== "string") return {
			ok: false,
			reason: "non-string-id",
			index: i
		};
		if (seen.has(k)) return {
			ok: false,
			reason: "duplicate-id",
			index: i,
			key: k
		};
		seen.add(k);
	}
	return { ok: true };
}
function ProdShell({ fieldId, items, keyOf, ordered, children, as: As = "div", itemAs: ItemAs = "div", className, itemClassName, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
		className: className ?? "deckio-editable-list",
		"data-deckio-list-field": fieldId || void 0,
		...rest,
		children: ordered.map((item, i) => {
			const k = keyOf ? keyOf(item, i) : i;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemAs, {
				className: itemClassName,
				"data-deckio-list-item-id": k != null ? String(k) : void 0,
				children: children(item, i, ordered)
			}, k != null ? String(k) : i);
		})
	});
}
function EditableList({ id, items = [], keyOf, children, as = "div", itemAs = "div", className, itemClassName, onReorder, ...rest }) {
	const ctx = (0, import_react.useContext)(InlineEditContext);
	const validation = (0, import_react.useMemo)(() => validateKeyOf(items, keyOf), [items, keyOf]);
	const stableIds = validation.ok;
	const savedOrder = stableIds && ctx ? readOrderEntry(ctx.overrides && ctx.overrides[id]) : null;
	const ordered = (0, import_react.useMemo)(() => {
		if (!stableIds) return items;
		if (!savedOrder || savedOrder.length === 0) return items;
		return applyOrder(savedOrder, items, keyOf);
	}, [
		stableIds,
		savedOrder,
		items,
		keyOf
	]);
	if (!ctx || !ctx.isDev || !stableIds) {
		if (!stableIds && typeof console !== "undefined" && console.warn && validation.reason !== "no-keyOf") try {
			if (ctx && ctx.isDev) console.warn(`[deckio] <EditableList id="${id}"> reorder disabled (${validation.reason}` + (validation.key ? `: "${validation.key}"` : "") + `). Add stable string \`id\` fields to your items.`);
		} catch {}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProdShell, {
			fieldId: id,
			items,
			keyOf,
			ordered,
			as,
			itemAs,
			className,
			itemClassName,
			...rest,
			children
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProdShell, {
			fieldId: id,
			items,
			keyOf,
			ordered,
			as,
			itemAs,
			className,
			itemClassName,
			...rest,
			children
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyEditableListSortable, {
			id,
			items,
			keyOf,
			ordered,
			as,
			itemAs,
			className,
			itemClassName,
			onReorder,
			...rest,
			children
		})
	});
}
/**
* useOrderedItems — hook variant for slides that want their own JSX wrapper
* but still benefit from the saved order. Returns the items in the saved
* order (or source order if the saved order is missing/invalid/etc).
*
* Use this when a slide can't use <EditableList> directly (e.g. complex
* layouts where the parent isn't a simple list container). The slide
* loses drag-and-drop UI but still respects any order saved elsewhere.
*/
function useOrderedItems(fieldId, items, keyOf) {
	const ctx = (0, import_react.useContext)(InlineEditContext);
	const stableIds = (0, import_react.useMemo)(() => validateKeyOf(items, keyOf), [items, keyOf]).ok;
	const savedOrder = stableIds && ctx ? readOrderEntry(ctx.overrides && ctx.overrides[fieldId]) : null;
	return (0, import_react.useMemo)(() => {
		if (!stableIds || !savedOrder || savedOrder.length === 0) return items;
		return applyOrder(savedOrder, items, keyOf);
	}, [
		stableIds,
		savedOrder,
		items,
		keyOf
	]);
}
//#endregion
export { useOrderedItems as n, InlineEditContext as r, EditableList as t };
