/**
* | output |
* | --- |
* | "Language" |
*
* @param {Shell_LanguageInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language: ((inputs?: Shell_LanguageInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_LanguageInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_LanguageInputs = {};
