/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Register_DescriptionInputs */

const en_auth_register_description = /** @type {(inputs: Auth_Register_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Register a demo user and choose the role for this account.`)
};

const nl_auth_register_description = /** @type {(inputs: Auth_Register_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registreer een demogebruiker en kies de rol voor dit account.`)
};

/**
* | output |
* | --- |
* | "Register a demo user and choose the role for this account." |
*
* @param {Auth_Register_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_description = /** @type {((inputs?: Auth_Register_DescriptionInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_DescriptionInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_register_description(inputs)
	return nl_auth_register_description(inputs)
});