/**
* | output |
* | --- |
* | "Toggle sidebar" |
*
* @param {Shell_Toggle_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_toggle_sidebar: ((inputs?: Shell_Toggle_SidebarInputs, options?: {
    locale?: "en" | "nl";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Shell_Toggle_SidebarInputs, {
    locale?: "en" | "nl";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shell_Toggle_SidebarInputs = {};
