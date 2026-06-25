/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Theme_LightInputs */

const en_shell_theme_light = /** @type {(inputs: Shell_Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Light`)
};

const nl_shell_theme_light = /** @type {(inputs: Shell_Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Licht`)
};

/**
* | output |
* | --- |
* | "Light" |
*
* @param {Shell_Theme_LightInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_light = /** @type {((inputs?: Shell_Theme_LightInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_LightInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_theme_light(inputs)
	return nl_shell_theme_light(inputs)
});