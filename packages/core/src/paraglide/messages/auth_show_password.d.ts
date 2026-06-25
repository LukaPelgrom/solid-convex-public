/**
* | output |
* | --- |
* | "Show password" |
*
* @param {Auth_Show_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_show_password: ((inputs?: Auth_Show_PasswordInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Show_PasswordInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Show_PasswordInputs = {};
