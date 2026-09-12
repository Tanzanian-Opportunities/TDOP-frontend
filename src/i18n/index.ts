import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

import en from './en.json';
import sw from './sw.json';

const fallbackLng = 'en';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('tdop-language') || 'en',
    fallbackLng,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    resources: {
      en: {
        translation: en,
      },
      sw: {
        translation: sw,
      },
    },
  });

export default i18n;
