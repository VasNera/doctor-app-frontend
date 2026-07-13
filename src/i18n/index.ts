import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import el from "./locales/el.json"
import en from "./locales/en.json"

const LANG_KEY = "doctor-app.lang"

export const SUPPORTED_LANGUAGES = ["el", "en"] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

i18n.use(initReactI18next).init({
  resources: {
    el: { translation: el },
    en: { translation: en },
  },
  lng: localStorage.getItem(LANG_KEY) ?? "el",
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React already escapes
})

export function changeLanguage(lang: Language) {
  void i18n.changeLanguage(lang)
  localStorage.setItem(LANG_KEY, lang)
}

export default i18n
