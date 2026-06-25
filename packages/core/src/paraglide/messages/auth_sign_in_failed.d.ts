/**
* | output |
* | --- |
* | "Sign in failed." |
*
* @param {Auth_Sign_In_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_failed: ((inputs?: Auth_Sign_In_FailedInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Auth_Sign_In_FailedInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auth_Sign_In_FailedInputs = {};
