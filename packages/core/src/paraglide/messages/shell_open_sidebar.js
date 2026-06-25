/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Open_SidebarInputs */

const en_shell_open_sidebar = /** @type {(inputs: Shell_Open_SidebarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open sidebar`)
};

const nl_shell_open_sidebar = /** @type {(inputs: Shell_Open_SidebarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sidebar openen`)
};

/**
* | output |
* | --- |
* | "Open sidebar" |
*
* @param {Shell_Open_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_open_sidebar = /** @type {((inputs?: Shell_Open_SidebarInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Open_SidebarInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_open_sidebar(inputs)
	return nl_shell_open_sidebar(inputs)
});