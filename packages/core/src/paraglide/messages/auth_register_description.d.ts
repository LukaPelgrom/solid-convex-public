/**
* | output |
* | --- |
* | "Register a demo user and choose the role for this account." |
*
* @param {Auth_Register_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_description: ((inputs?: Auth_Register_DescriptionInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Register_DescriptionInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Register_DescriptionInputs = {};
