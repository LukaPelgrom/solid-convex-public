/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Theme_SystemInputs */

const en_shell_theme_system = /** @type {(inputs: Shell_Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System`)
};

const nl_shell_theme_system = /** @type {(inputs: Shell_Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Systeem`)
};

/**
* | output |
* | --- |
* | "System" |
*
* @param {Shell_Theme_SystemInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_system = /** @type {((inputs?: Shell_Theme_SystemInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_SystemInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_theme_system(inputs)
	return nl_shell_theme_system(inputs)
});