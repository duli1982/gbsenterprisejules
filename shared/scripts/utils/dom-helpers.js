/**
 * A utility module for simplifying DOM selection.
 * This implementation is based on the "10/10 Optimization Plan".
 */

/**
 * A concise query selector function.
 * @param {string} sel - The CSS selector.
 * @param {Element|Document} [parent=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null if not found.
 */
export const $ = (sel, parent = document) => parent.querySelector(sel);

/**
 * A concise query selector all function that returns a true array.
 * @param {string} sel - The CSS selector.
 * @param {Element|Document} [parent=document] - The parent element to search within.
 * @returns {Element[]} An array of matching elements.
 */
export const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// --- Legacy Aliases for Backward Compatibility ---
// These can be phased out over time as the codebase is updated.

/**
 * @deprecated Use `$` instead.
 */
export const qs = $;

/**
 * @deprecated Use `$$` instead.
 */
export const qsa = (sel, parent) => $$(sel, parent);

/**
 * @deprecated Use `$` instead. This function is redundant.
 */
export const getElement = $;
