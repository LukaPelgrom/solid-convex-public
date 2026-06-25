/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Create_AccountInputs */

const en_auth_create_account = /** @type {(inputs: Auth_Create_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create account`)
};

const nl_auth_create_account = /** @type {(inputs: Auth_Create_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account aanmaken`)
};

/**
* | output |
* | --- |
* | "Create account" |
*
* @param {Auth_Create_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_account = /** @type {((inputs?: Auth_Create_AccountInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Create_AccountInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_create_account(inputs)
	return nl_auth_create_account(inputs)
});