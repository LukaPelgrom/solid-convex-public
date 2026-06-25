/**
* | output |
* | --- |
* | "Open sidebar" |
*
* @param {Shell_Open_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_open_sidebar: ((inputs?: Shell_Open_SidebarInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Open_SidebarInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Open_SidebarInputs = {};
