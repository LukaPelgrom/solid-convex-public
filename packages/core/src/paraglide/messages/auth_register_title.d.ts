/**
* | output |
* | --- |
* | "Create user" |
*
* @param {Auth_Register_TitleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_title: ((inputs?: Auth_Register_TitleInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Register_TitleInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Register_TitleInputs = {};
