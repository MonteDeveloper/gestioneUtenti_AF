import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {translation as IT} from "./languages/it";
import {translation as ENG} from "./languages/eng";

const resources = {
  en: {
    translation: ENG
  },
  it: {
    translation: IT
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;