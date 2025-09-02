import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import uk from "./locales/uk.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ru from "./locales/ru.json";

const resources = {
  uk: { translation: uk },
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de", // Основной язык - немецкий
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
