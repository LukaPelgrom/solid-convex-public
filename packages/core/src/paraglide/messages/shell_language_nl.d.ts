/**
* | output |
* | --- |
* | "Nederlands" |
*
* @param {Shell_Language_NlInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language_nl: ((inputs?: Shell_Language_NlInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Language_NlInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Language_NlInputs = {};
