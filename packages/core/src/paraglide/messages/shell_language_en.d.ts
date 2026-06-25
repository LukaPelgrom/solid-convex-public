/**
* | output |
* | --- |
* | "English" |
*
* @param {Shell_Language_EnInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language_en: ((inputs?: Shell_Language_EnInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Language_EnInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Language_EnInputs = {};
