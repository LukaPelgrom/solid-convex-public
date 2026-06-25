/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Auth_Sign_In_TitleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_title: ((inputs?: Auth_Sign_In_TitleInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Sign_In_TitleInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Sign_In_TitleInputs = {};
