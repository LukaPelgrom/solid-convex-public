/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_TaglineInputs */

const en_shell_tagline = /** @type {(inputs: Shell_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solid + Convex`)
};

const nl_shell_tagline = /** @type {(inputs: Shell_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solid + Convex`)
};

/**
* | output |
* | --- |
* | "Solid + Convex" |
*
* @param {Shell_TaglineInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_tagline = /** @type {((inputs?: Shell_TaglineInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_TaglineInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_tagline(inputs)
	return nl_shell_tagline(inputs)
});