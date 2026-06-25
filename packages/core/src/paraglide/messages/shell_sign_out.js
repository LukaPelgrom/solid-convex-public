/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shell_Sign_OutInputs */

const en_shell_sign_out = /** @type {(inputs: Shell_Sign_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out`)
};

const nl_shell_sign_out = /** @type {(inputs: Shell_Sign_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uitloggen`)
};

/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Shell_Sign_OutInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_sign_out = /** @type {((inputs?: Shell_Sign_OutInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Sign_OutInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_shell_sign_out(inputs)
	return nl_shell_sign_out(inputs)
});