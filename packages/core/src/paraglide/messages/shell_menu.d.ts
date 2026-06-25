/**
* | output |
* | --- |
* | "Menu" |
*
* @param {Shell_MenuInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_menu: ((inputs?: Shell_MenuInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_MenuInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_MenuInputs = {};
