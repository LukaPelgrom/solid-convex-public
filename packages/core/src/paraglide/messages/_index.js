/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} Auth_BrandInputs */
/** @typedef {{}} Auth_Sign_In_TitleInputs */
/** @typedef {{}} Auth_Sign_In_DescriptionInputs */
/** @typedef {{}} Auth_Register_TitleInputs */
/** @typedef {{}} Auth_Register_DescriptionInputs */
/** @typedef {{}} Auth_EmailInputs */
/** @typedef {{}} Auth_NameInputs */
/** @typedef {{}} Auth_PasswordInputs */
/** @typedef {{}} Auth_RoleInputs */
/** @typedef {{}} Auth_Sign_InInputs */
/** @typedef {{}} Auth_Create_AccountInputs */
/** @typedef {{}} Auth_Need_UserInputs */
/** @typedef {{}} Auth_Create_OneInputs */
/** @typedef {{}} Auth_Have_AccountInputs */
/** @typedef {{}} Auth_Sign_In_FailedInputs */
/** @typedef {{}} Auth_Registration_FailedInputs */
/** @typedef {{}} Auth_Show_PasswordInputs */
/** @typedef {{}} Auth_Hide_PasswordInputs */
/** @typedef {{}} Shell_ProductInputs */
/** @typedef {{}} Shell_TaglineInputs */
/** @typedef {{}} Shell_MenuInputs */
/** @typedef {{}} Shell_Sign_OutInputs */
/** @typedef {{}} Shell_Toggle_SidebarInputs */
/** @typedef {{}} Shell_Open_SidebarInputs */
/** @typedef {{}} Shell_ThemeInputs */
/** @typedef {{}} Shell_Theme_LightInputs */
/** @typedef {{}} Shell_Theme_DarkInputs */
/** @typedef {{}} Shell_Theme_SystemInputs */
/** @typedef {{}} Shell_LanguageInputs */
/** @typedef {{}} Shell_Language_EnInputs */
/** @typedef {{}} Shell_Language_NlInputs */
import * as __en from "./en.js"
import * as __nl from "./nl.js"
/**
* | output |
* | --- |
* | "solid-convex-public" |
*
* @param {Auth_BrandInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_brand = /** @type {((inputs?: Auth_BrandInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_BrandInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_brand(inputs)
	return __nl.auth_brand(inputs)
});
/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Auth_Sign_In_TitleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_title = /** @type {((inputs?: Auth_Sign_In_TitleInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_In_TitleInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_sign_in_title(inputs)
	return __nl.auth_sign_in_title(inputs)
});
/**
* | output |
* | --- |
* | "Enter your email and password to continue." |
*
* @param {Auth_Sign_In_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_description = /** @type {((inputs?: Auth_Sign_In_DescriptionInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_In_DescriptionInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_sign_in_description(inputs)
	return __nl.auth_sign_in_description(inputs)
});
/**
* | output |
* | --- |
* | "Create user" |
*
* @param {Auth_Register_TitleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_title = /** @type {((inputs?: Auth_Register_TitleInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_TitleInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_register_title(inputs)
	return __nl.auth_register_title(inputs)
});
/**
* | output |
* | --- |
* | "Register a demo user and choose the role for this account." |
*
* @param {Auth_Register_DescriptionInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_register_description = /** @type {((inputs?: Auth_Register_DescriptionInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_DescriptionInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_register_description(inputs)
	return __nl.auth_register_description(inputs)
});
/**
* | output |
* | --- |
* | "Email" |
*
* @param {Auth_EmailInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_email = /** @type {((inputs?: Auth_EmailInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_EmailInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_email(inputs)
	return __nl.auth_email(inputs)
});
/**
* | output |
* | --- |
* | "Name" |
*
* @param {Auth_NameInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_name = /** @type {((inputs?: Auth_NameInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_NameInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_name(inputs)
	return __nl.auth_name(inputs)
});
/**
* | output |
* | --- |
* | "Password" |
*
* @param {Auth_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_password = /** @type {((inputs?: Auth_PasswordInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_PasswordInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_password(inputs)
	return __nl.auth_password(inputs)
});
/**
* | output |
* | --- |
* | "Role" |
*
* @param {Auth_RoleInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_role = /** @type {((inputs?: Auth_RoleInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_RoleInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_role(inputs)
	return __nl.auth_role(inputs)
});
/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Auth_Sign_InInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in = /** @type {((inputs?: Auth_Sign_InInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_InInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_sign_in(inputs)
	return __nl.auth_sign_in(inputs)
});
/**
* | output |
* | --- |
* | "Create account" |
*
* @param {Auth_Create_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_account = /** @type {((inputs?: Auth_Create_AccountInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Create_AccountInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_create_account(inputs)
	return __nl.auth_create_account(inputs)
});
/**
* | output |
* | --- |
* | "Need a new user?" |
*
* @param {Auth_Need_UserInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_need_user = /** @type {((inputs?: Auth_Need_UserInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Need_UserInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_need_user(inputs)
	return __nl.auth_need_user(inputs)
});
/**
* | output |
* | --- |
* | "Create one" |
*
* @param {Auth_Create_OneInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_create_one = /** @type {((inputs?: Auth_Create_OneInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Create_OneInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_create_one(inputs)
	return __nl.auth_create_one(inputs)
});
/**
* | output |
* | --- |
* | "Already have an account?" |
*
* @param {Auth_Have_AccountInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_have_account = /** @type {((inputs?: Auth_Have_AccountInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Have_AccountInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_have_account(inputs)
	return __nl.auth_have_account(inputs)
});
/**
* | output |
* | --- |
* | "Sign in failed." |
*
* @param {Auth_Sign_In_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_sign_in_failed = /** @type {((inputs?: Auth_Sign_In_FailedInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Sign_In_FailedInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_sign_in_failed(inputs)
	return __nl.auth_sign_in_failed(inputs)
});
/**
* | output |
* | --- |
* | "Registration failed." |
*
* @param {Auth_Registration_FailedInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_registration_failed = /** @type {((inputs?: Auth_Registration_FailedInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Registration_FailedInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_registration_failed(inputs)
	return __nl.auth_registration_failed(inputs)
});
/**
* | output |
* | --- |
* | "Show password" |
*
* @param {Auth_Show_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_show_password = /** @type {((inputs?: Auth_Show_PasswordInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Show_PasswordInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_show_password(inputs)
	return __nl.auth_show_password(inputs)
});
/**
* | output |
* | --- |
* | "Hide password" |
*
* @param {Auth_Hide_PasswordInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const auth_hide_password = /** @type {((inputs?: Auth_Hide_PasswordInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Hide_PasswordInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.auth_hide_password(inputs)
	return __nl.auth_hide_password(inputs)
});
/**
* | output |
* | --- |
* | "Solid Convex Public" |
*
* @param {Shell_ProductInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_product = /** @type {((inputs?: Shell_ProductInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_ProductInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_product(inputs)
	return __nl.shell_product(inputs)
});
/**
* | output |
* | --- |
* | "Solid + Convex" |
*
* @param {Shell_TaglineInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_tagline = /** @type {((inputs?: Shell_TaglineInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_TaglineInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_tagline(inputs)
	return __nl.shell_tagline(inputs)
});
/**
* | output |
* | --- |
* | "Menu" |
*
* @param {Shell_MenuInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_menu = /** @type {((inputs?: Shell_MenuInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_MenuInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_menu(inputs)
	return __nl.shell_menu(inputs)
});
/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Shell_Sign_OutInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_sign_out = /** @type {((inputs?: Shell_Sign_OutInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Sign_OutInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_sign_out(inputs)
	return __nl.shell_sign_out(inputs)
});
/**
* | output |
* | --- |
* | "Toggle sidebar" |
*
* @param {Shell_Toggle_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_toggle_sidebar = /** @type {((inputs?: Shell_Toggle_SidebarInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Toggle_SidebarInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_toggle_sidebar(inputs)
	return __nl.shell_toggle_sidebar(inputs)
});
/**
* | output |
* | --- |
* | "Open sidebar" |
*
* @param {Shell_Open_SidebarInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_open_sidebar = /** @type {((inputs?: Shell_Open_SidebarInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Open_SidebarInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_open_sidebar(inputs)
	return __nl.shell_open_sidebar(inputs)
});
/**
* | output |
* | --- |
* | "Theme" |
*
* @param {Shell_ThemeInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme = /** @type {((inputs?: Shell_ThemeInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_ThemeInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_theme(inputs)
	return __nl.shell_theme(inputs)
});
/**
* | output |
* | --- |
* | "Light" |
*
* @param {Shell_Theme_LightInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_light = /** @type {((inputs?: Shell_Theme_LightInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_LightInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_theme_light(inputs)
	return __nl.shell_theme_light(inputs)
});
/**
* | output |
* | --- |
* | "Dark" |
*
* @param {Shell_Theme_DarkInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_dark = /** @type {((inputs?: Shell_Theme_DarkInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_DarkInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_theme_dark(inputs)
	return __nl.shell_theme_dark(inputs)
});
/**
* | output |
* | --- |
* | "System" |
*
* @param {Shell_Theme_SystemInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_theme_system = /** @type {((inputs?: Shell_Theme_SystemInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Theme_SystemInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_theme_system(inputs)
	return __nl.shell_theme_system(inputs)
});
/**
* | output |
* | --- |
* | "Language" |
*
* @param {Shell_LanguageInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language = /** @type {((inputs?: Shell_LanguageInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_LanguageInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_language(inputs)
	return __nl.shell_language(inputs)
});
/**
* | output |
* | --- |
* | "English" |
*
* @param {Shell_Language_EnInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language_en = /** @type {((inputs?: Shell_Language_EnInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Language_EnInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_language_en(inputs)
	return __nl.shell_language_en(inputs)
});
/**
* | output |
* | --- |
* | "Nederlands" |
*
* @param {Shell_Language_NlInputs} inputs
* @param {{ locale?: "en" | "nl" }} options
* @returns {LocalizedString}
*/
export const shell_language_nl = /** @type {((inputs?: Shell_Language_NlInputs, options?: { locale?: "en" | "nl" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shell_Language_NlInputs, { locale?: "en" | "nl" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return __en.shell_language_nl(inputs)
	return __nl.shell_language_nl(inputs)
});