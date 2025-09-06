import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

const resources = {
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
  ru: { translation: ru },
  uk: { translation: uk },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;