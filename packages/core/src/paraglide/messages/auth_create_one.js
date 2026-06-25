/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Create_OneInputs */

const en_auth_create_one = /** @type {(inputs: Auth_Create_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create one`)
};

const nl_auth_create_one = /** @type {(inputs: Auth_Create_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maak er een aan`)
};

/**
* | output |
* | --- |
* | "Create one" |
*
* @param {Auth_Create_OneInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_one = /** @type {((inputs?: Auth_Create_OneInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Create_OneInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_create_one(inputs)
	return nl_auth_create_one(inputs)
});