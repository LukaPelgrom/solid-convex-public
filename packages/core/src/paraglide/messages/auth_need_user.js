/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Need_UserInputs */

const en_auth_need_user = /** @type {(inputs: Auth_Need_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Need a new user?`)
};

const nl_auth_need_user = /** @type {(inputs: Auth_Need_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nieuwe gebruiker nodig?`)
};

/**
* | output |
* | --- |
* | "Need a new user?" |
*
* @param {Auth_Need_UserInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_need_user = /** @type {((inputs?: Auth_Need_UserInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Need_UserInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_need_user(inputs)
	return nl_auth_need_user(inputs)
});