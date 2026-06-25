/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Registration_FailedInputs */

const en_auth_registration_failed = /** @type {(inputs: Auth_Registration_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registration failed.`)
};

const nl_auth_registration_failed = /** @type {(inputs: Auth_Registration_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registratie mislukt.`)
};

/**
* | output |
* | --- |
* | "Registration failed." |
*
* @param {Auth_Registration_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_registration_failed = /** @type {((inputs?: Auth_Registration_FailedInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Registration_FailedInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_registration_failed(inputs)
	return nl_auth_registration_failed(inputs)
});