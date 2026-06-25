/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Sign_In_DescriptionInputs */

const en_auth_sign_in_description = /** @type {(inputs: Auth_Sign_In_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter your email and password to continue.`)
};

const nl_auth_sign_in_description = /** @type {(inputs: Auth_Sign_In_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vul je e-mailadres en wachtwoord in om door te gaan.`)
};

/**
* | output |
* | --- |
* | "Enter your email and password to continue." |
*
* @param {Auth_Sign_In_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_description = /** @type {((inputs?: Auth_Sign_In_DescriptionInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_In_DescriptionInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_sign_in_description(inputs)
	return nl_auth_sign_in_description(inputs)
});