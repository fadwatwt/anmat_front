import i18n from "i18next";
import HttpApi from "i18next-http-backend"
import languageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from "react-i18next";
import nextI18NextConfig from "/next-i18next.config.mjs"

i18n.use(HttpApi)
.use(languageDetector)
.use(initReactI18next)
.init({
    ...nextI18NextConfig.i18n,
    backend:{
        loadPath: "/locales/{{lng}}/translation.json"
    },
    detection:{
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
        cache:"cookie"
    },
    react:{
        useSuspense:false,
    }
})

export default i18n