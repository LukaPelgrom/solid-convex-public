/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_BrandInputs */

const en_auth_brand = /** @type {(inputs: Auth_BrandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`solid-configs-public`)
};

const nl_auth_brand = /** @type {(inputs: Auth_BrandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`solid-configs-public`)
};

/**
* | output |
* | --- |
* | "solid-configs-public" |
*
* @param {Auth_BrandInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_brand = /** @type {((inputs?: Auth_BrandInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_BrandInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_brand(inputs)
	return nl_auth_brand(inputs)
});