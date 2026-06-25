/**
* | output |
* | --- |
* | "Create account" |
*
* @param {Auth_Create_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_account: ((inputs?: Auth_Create_AccountInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Create_AccountInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Create_AccountInputs = {};
