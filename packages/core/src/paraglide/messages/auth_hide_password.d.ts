/**
* | output |
* | --- |
* | "Hide password" |
*
* @param {Auth_Hide_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_hide_password: ((inputs?: Auth_Hide_PasswordInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Hide_PasswordInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Hide_PasswordInputs = {};
