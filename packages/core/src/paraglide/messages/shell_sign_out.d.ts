/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Shell_Sign_OutInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_sign_out: ((inputs?: Shell_Sign_OutInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Sign_OutInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Sign_OutInputs = {};
