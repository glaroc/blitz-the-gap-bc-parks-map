/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface TranslationContextObj<T, U> {
  language: string;
  changeLanguage: T;
  t: U;
}
const TranslationContext = createContext<TranslationContextObj<any, any>>({
  language: "fr",
  changeLanguage: (language: string) => language,
  t: (text: string) => text,
});

export const TranslateWrapper = (props: any) => {
  const { t } = useTranslation();
  const { i18n, children } = props;
  const [language, setLanguage] = useState("fr");

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language && language.length === 2 ? language : "fr");
    setLanguage(language);
  };

  useEffect(() => {
    setLanguage("fr");
  }, []);

  document.title = t(
    "STAC Viewer"
  );

  return (
    <TranslationContext.Provider
      value={{
        language,
        changeLanguage,
        t: t.bind(this),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;
