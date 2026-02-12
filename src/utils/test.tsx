import React from "react";
import { render, RenderOptions, act } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import { getForAllGroupsOfSpeciesEnFr, addTranslation } from "./utils/helpers";

import { Provider } from "react-redux";
import store from "../store";
import { TranslateWrapper } from "../context/Translation";

import en from "../locales/en/translateEn.json";
import fr from "../locales/fr/translateFr.json";

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

const ComponentWrapperForTest: React.FC = (props: any) => (
  <Provider store={store}>
    <TranslateWrapper i18n={i18n}>{props.children}</TranslateWrapper>
  </Provider>
);

/**
 * Wraps testing-libraries render function so that we can centralize the
 * supply of providers to our test
 * @param ui - The React element to render
 * @param options - rendering options
 * @returns the result of the render
 */
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: ComponentWrapperForTest, ...options });

// re-export everything.
export * from "@testing-library/react";

// override render method
export { customRender as render };
