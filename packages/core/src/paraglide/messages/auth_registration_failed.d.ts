/**
* | output |
* | --- |
* | "Registration failed." |
*
* @param {Auth_Registration_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_registration_failed: ((inputs?: Auth_Registration_FailedInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Registration_FailedInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Registration_FailedInputs = {};
