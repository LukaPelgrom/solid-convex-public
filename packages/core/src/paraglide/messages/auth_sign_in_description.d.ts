/**
* | output |
* | --- |
* | "Enter your email and password to continue." |
*
* @param {Auth_Sign_In_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_description: ((inputs?: Auth_Sign_In_DescriptionInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Sign_In_DescriptionInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Sign_In_DescriptionInputs = {};
