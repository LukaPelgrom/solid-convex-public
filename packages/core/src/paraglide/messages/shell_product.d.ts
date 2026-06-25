/**
* | output |
* | --- |
* | "Solid Configs Public" |
*
* @param {Shell_ProductInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_product: ((inputs?: Shell_ProductInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_ProductInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_ProductInputs = {};
