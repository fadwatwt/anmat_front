import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import arTranslation from "../locales/ar/translation.json";

i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        resources: { en: { translation: enTranslation }, ar: { translation: arTranslation } },
        partialBundledLanguages: true,
        initImmediate: false,
        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },
        supportedLngs: ["en", "ar"],
        nonExplicitSupportedLngs: true,
        react: {
            useSuspense: false,
        },
    });

export default i18n;
