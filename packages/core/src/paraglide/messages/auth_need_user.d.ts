/**
* | output |
* | --- |
* | "Need a new user?" |
*
* @param {Auth_Need_UserInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_need_user: ((inputs?: Auth_Need_UserInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Need_UserInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Need_UserInputs = {};
