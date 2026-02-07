import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";

import i18n, { LANGUAGES, type LanguageCode } from "./index";

const LANGUAGE_KEY = "user_language_preference";

interface I18nContextType {
	language: LanguageCode;
	setLanguage: (lang: LanguageCode) => Promise<void>;
	languages: typeof LANGUAGES;
	isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<LanguageCode>("en");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadSavedLanguage();
	}, []);

	const loadSavedLanguage = async () => {
		try {
			const savedLang = await SecureStore.getItemAsync(LANGUAGE_KEY);
			if (savedLang && savedLang in LANGUAGES) {
				await setLanguageState(savedLang as LanguageCode);
				await i18n.changeLanguage(savedLang);
				// Apply RTL if needed
				if (LANGUAGES[savedLang as LanguageCode].isRTL) {
					I18nManager.forceRTL(true);
				}
			} else {
				// Auto-detect device language
				const deviceLang = Localization.getLocales()[0]?.languageCode || "en";
				if (deviceLang in LANGUAGES) {
					await setLanguageState(deviceLang as LanguageCode);
					await i18n.changeLanguage(deviceLang);
					if (LANGUAGES[deviceLang as LanguageCode].isRTL) {
						I18nManager.forceRTL(true);
					}
				}
			}
		} catch (error) {
			console.error("Error loading language:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const setLanguage = async (lang: LanguageCode) => {
		try {
			await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
			await i18n.changeLanguage(lang);
			setLanguageState(lang);
			// Apply RTL if needed
			if (LANGUAGES[lang].isRTL !== I18nManager.isRTL) {
				I18nManager.forceRTL(LANGUAGES[lang].isRTL);
			}
		} catch (error) {
			console.error("Error saving language:", error);
		}
	};

	if (isLoading) {
		return null;
	}

	return (
		<I18nContext.Provider
			value={{
				language,
				setLanguage,
				languages: LANGUAGES,
				isRTL: LANGUAGES[language].isRTL,
			}}
		>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within I18nProvider");
	}
	const { t } = useTranslation();
	return { ...context, t };
}
