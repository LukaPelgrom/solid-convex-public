/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Show_PasswordInputs */

const en_auth_show_password = /** @type {(inputs: Auth_Show_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show password`)
};

const nl_auth_show_password = /** @type {(inputs: Auth_Show_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wachtwoord tonen`)
};

/**
* | output |
* | --- |
* | "Show password" |
*
* @param {Auth_Show_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_show_password = /** @type {((inputs?: Auth_Show_PasswordInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Show_PasswordInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_show_password(inputs)
	return nl_auth_show_password(inputs)
});