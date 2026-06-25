/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Theme_DarkInputs */

const en_shell_theme_dark = /** @type {(inputs: Shell_Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dark`)
};

const nl_shell_theme_dark = /** @type {(inputs: Shell_Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Donker`)
};

/**
* | output |
* | --- |
* | "Dark" |
*
* @param {Shell_Theme_DarkInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_dark = /** @type {((inputs?: Shell_Theme_DarkInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_DarkInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_theme_dark(inputs)
	return nl_shell_theme_dark(inputs)
});