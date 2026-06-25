/**
* | output |
* | --- |
* | "solid-configs-public" |
*
* @param {Auth_BrandInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_brand: ((inputs?: Auth_BrandInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_BrandInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_BrandInputs = {};
