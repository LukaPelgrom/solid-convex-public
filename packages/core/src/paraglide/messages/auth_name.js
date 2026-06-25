/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_NameInputs */

const en_auth_name = /** @type {(inputs: Auth_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const nl_auth_name = /** @type {(inputs: Auth_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naam`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Auth_NameInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_name = /** @type {((inputs?: Auth_NameInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_NameInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_name(inputs)
	return nl_auth_name(inputs)
});