/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Register_TitleInputs */

const en_auth_register_title = /** @type {(inputs: Auth_Register_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create user`)
};

const nl_auth_register_title = /** @type {(inputs: Auth_Register_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gebruiker aanmaken`)
};

/**
* | output |
* | --- |
* | "Create user" |
*
* @param {Auth_Register_TitleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_title = /** @type {((inputs?: Auth_Register_TitleInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_TitleInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_register_title(inputs)
	return nl_auth_register_title(inputs)
});