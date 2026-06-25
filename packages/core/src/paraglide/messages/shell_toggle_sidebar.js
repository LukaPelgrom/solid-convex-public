/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Toggle_SidebarInputs */

const en_shell_toggle_sidebar = /** @type {(inputs: Shell_Toggle_SidebarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toggle sidebar`)
};

const nl_shell_toggle_sidebar = /** @type {(inputs: Shell_Toggle_SidebarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sidebar inklappen`)
};

/**
* | output |
* | --- |
* | "Toggle sidebar" |
*
* @param {Shell_Toggle_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_toggle_sidebar = /** @type {((inputs?: Shell_Toggle_SidebarInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Toggle_SidebarInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_toggle_sidebar(inputs)
	return nl_shell_toggle_sidebar(inputs)
});