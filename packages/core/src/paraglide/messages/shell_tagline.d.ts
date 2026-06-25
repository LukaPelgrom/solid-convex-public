/**
* | output |
* | --- |
* | "Solid + Convex" |
*
* @param {Shell_TaglineInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_tagline: ((inputs?: Shell_TaglineInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_TaglineInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_TaglineInputs = {};
