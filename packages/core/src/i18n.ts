import { createSignal } from "solid-js";
import { m } from "./paraglide/messages";
import {
  getLocale,
  isLocale,
  locales,
  setLocale,
  type Locale,
} from "./paraglide/runtime";

const [currentLocale, setCurrentLocale] = createSignal<Locale>(
  isLocale(getLocale()) ? getLocale() : "en",
);

export { m, locales, type Locale };

export const appLocale = currentLocale;

export const msg = (message: () => string) => {
  currentLocale();
  return message();
};

export const setAppLocale = (locale: Locale) => {
  setLocale(locale, { reload: false });
  setCurrentLocale(locale);
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
};

export const toggleAppLocale = () => {
  setAppLocale(currentLocale() === "nl" ? "en" : "nl");
};

export const localeLabel = (locale: Locale) =>
  locale === "nl" ? msg(m.shell_language_nl) : msg(m.shell_language_en);
