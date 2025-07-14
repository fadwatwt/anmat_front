import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        fallbackLng: "en",

        description:{
            order: [
                'localStorage',
                'htmlTag',
                'querystring',
                'cookie',
                'sessionStorage',
                'navigator',
                'path',
                'subdomain'
            ],
            caches:["cookie"]
        },
        backend:{
            loadPath: '/locale/{{lng}}/translation.json',
        }
    });



export default i18n;