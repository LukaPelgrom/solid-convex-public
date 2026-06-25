/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Have_AccountInputs */

const en_auth_have_account = /** @type {(inputs: Auth_Have_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already have an account?`)
};

const nl_auth_have_account = /** @type {(inputs: Auth_Have_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heb je al een account?`)
};

/**
* | output |
* | --- |
* | "Already have an account?" |
*
* @param {Auth_Have_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_have_account = /** @type {((inputs?: Auth_Have_AccountInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Have_AccountInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_have_account(inputs)
	return nl_auth_have_account(inputs)
});