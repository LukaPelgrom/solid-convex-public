/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Sign_In_FailedInputs */

const en_auth_sign_in_failed = /** @type {(inputs: Auth_Sign_In_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in failed.`)
};

const nl_auth_sign_in_failed = /** @type {(inputs: Auth_Sign_In_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inloggen mislukt.`)
};

/**
* | output |
* | --- |
* | "Sign in failed." |
*
* @param {Auth_Sign_In_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_failed = /** @type {((inputs?: Auth_Sign_In_FailedInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_In_FailedInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_sign_in_failed(inputs)
	return nl_auth_sign_in_failed(inputs)
});