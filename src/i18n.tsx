import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LocizeBackend from 'i18next-locize-backend';

const locizeOptions = {
    projectId: import.meta.env.VITE_LOCIZE_PROJECT_ID,
    apiKey: import.meta.env.VITE_LOCIZE_API_KEY,
    referenceLng: 'en',
    version: 'latest'
  };

i18n
  .use(LocizeBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: locizeOptions,
    ns: ['FoxTow'],
    defaultNS: 'FoxTow',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true // Using the new Suspense approach
    },
    supportedLngs: ['en', 'es', 'fil']
  });


export default i18n;