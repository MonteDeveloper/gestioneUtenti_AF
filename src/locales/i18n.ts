import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translation as IT } from "./languages/it";
import { translation as ENG } from "./languages/eng";
import { enUS, it } from "date-fns/locale";

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

export const getCurrentLocale = () => {
  switch (true) {
    case i18n.language == 'it':
      return it;
    case i18n.language == 'en':
      default:
        return enUS;
  }
}