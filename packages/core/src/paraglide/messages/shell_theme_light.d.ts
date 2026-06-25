/**
* | output |
* | --- |
* | "Light" |
*
* @param {Shell_Theme_LightInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_light: ((inputs?: Shell_Theme_LightInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Theme_LightInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Theme_LightInputs = {};
