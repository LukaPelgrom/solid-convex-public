/**
* | output |
* | --- |
* | "Dark" |
*
* @param {Shell_Theme_DarkInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_dark: ((inputs?: Shell_Theme_DarkInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Theme_DarkInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Theme_DarkInputs = {};
