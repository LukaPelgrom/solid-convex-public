/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Hide_PasswordInputs */

const en_auth_hide_password = /** @type {(inputs: Auth_Hide_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide password`)
};

const nl_auth_hide_password = /** @type {(inputs: Auth_Hide_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wachtwoord verbergen`)
};

/**
* | output |
* | --- |
* | "Hide password" |
*
* @param {Auth_Hide_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_hide_password = /** @type {((inputs?: Auth_Hide_PasswordInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Hide_PasswordInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_hide_password(inputs)
	return nl_auth_hide_password(inputs)
});