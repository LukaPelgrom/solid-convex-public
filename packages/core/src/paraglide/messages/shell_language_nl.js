/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Language_NlInputs */

const en_shell_language_nl = /** @type {(inputs: Shell_Language_NlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nederlands`)
};

const nl_shell_language_nl = /** @type {(inputs: Shell_Language_NlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nederlands`)
};

/**
* | output |
* | --- |
* | "Nederlands" |
*
* @param {Shell_Language_NlInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language_nl = /** @type {((inputs?: Shell_Language_NlInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Language_NlInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_language_nl(inputs)
	return nl_shell_language_nl(inputs)
});