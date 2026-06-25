/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_ThemeInputs */

const en_shell_theme = /** @type {(inputs: Shell_ThemeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Theme`)
};

const nl_shell_theme = /** @type {(inputs: Shell_ThemeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thema`)
};

/**
* | output |
* | --- |
* | "Theme" |
*
* @param {Shell_ThemeInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme = /** @type {((inputs?: Shell_ThemeInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_ThemeInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_theme(inputs)
	return nl_shell_theme(inputs)
});