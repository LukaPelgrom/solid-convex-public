/**
* | output |
* | --- |
* | "Create one" |
*
* @param {Auth_Create_OneInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_one: ((inputs?: Auth_Create_OneInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Create_OneInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Create_OneInputs = {};
