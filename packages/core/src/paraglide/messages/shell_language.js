/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_LanguageInputs */

const en_shell_language = /** @type {(inputs: Shell_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

const nl_shell_language = /** @type {(inputs: Shell_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taal`)
};

/**
* | output |
* | --- |
* | "Language" |
*
* @param {Shell_LanguageInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language = /** @type {((inputs?: Shell_LanguageInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_LanguageInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_language(inputs)
	return nl_shell_language(inputs)
});