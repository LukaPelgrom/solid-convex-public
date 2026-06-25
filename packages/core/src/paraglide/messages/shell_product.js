/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_ProductInputs */

const en_shell_product = /** @type {(inputs: Shell_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solid Configs Public`)
};

const nl_shell_product = /** @type {(inputs: Shell_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solid Configs Public`)
};

/**
* | output |
* | --- |
* | "Solid Configs Public" |
*
* @param {Shell_ProductInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_product = /** @type {((inputs?: Shell_ProductInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_ProductInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_product(inputs)
	return nl_shell_product(inputs)
});