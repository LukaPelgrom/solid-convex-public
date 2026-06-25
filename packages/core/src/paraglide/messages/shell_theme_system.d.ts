/**
* | output |
* | --- |
* | "System" |
*
* @param {Shell_Theme_SystemInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_system: ((inputs?: Shell_Theme_SystemInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Theme_SystemInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Theme_SystemInputs = {};
