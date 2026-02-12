import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { addTranslation } from "./utils/helpers";
import en from "./locales/en/translateEn.json";
import fr from "./locales/fr/translateFr.json";

const rs = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    react: {
      useSuspense: false,
    },
    ns: ["translation"],
    defaultNS: "translation",
    resources: rs,
    lng: "fr",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["querystring", "path", "navigator"],
      lookupQuerystring: "lang",
    },
  });

const loadTranslations = async (i18n: any, rs: any) => {
  addTranslation(i18n, rs, {});
  i18n.changeLanguage("fr");
};

loadTranslations(i18n, rs);

export default i18n;
