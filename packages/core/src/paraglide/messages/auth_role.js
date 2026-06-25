/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_RoleInputs */

const en_auth_role = /** @type {(inputs: Auth_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

const nl_auth_role = /** @type {(inputs: Auth_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rol`)
};

/**
* | output |
* | --- |
* | "Role" |
*
* @param {Auth_RoleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_role = /** @type {((inputs?: Auth_RoleInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_RoleInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_role(inputs)
	return nl_auth_role(inputs)
});