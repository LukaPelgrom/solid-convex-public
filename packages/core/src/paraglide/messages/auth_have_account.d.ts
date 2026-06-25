/**
* | output |
* | --- |
* | "Already have an account?" |
*
* @param {Auth_Have_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_have_account: ((inputs?: Auth_Have_AccountInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Have_AccountInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Have_AccountInputs = {};
