import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bn from "./locales/bn.json";
import en from "./locales/en.json";
import hi from "./locales/hi.json";

export const LANGUAGES = {
	en: { name: "English", flag: "🇺🇸", isRTL: false },
	hi: { name: "हिंदी", flag: "🇮🇳", isRTL: false },
	bn: { name: "বাংলা", flag: "🇮🇳", isRTL: false },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		hi: { translation: hi },
		bn: { translation: bn },
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
