import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import {
	getThemePreference,
	setThemePreference,
	type ThemePreference,
} from "./theme-store";

export type { ThemePreference };

interface ThemeContextType {
	colorScheme: "light" | "dark";
	themePreference: ThemePreference;
	isDarkColorScheme: boolean;
	setTheme: (theme: ThemePreference) => Promise<void>;
	toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemColorScheme = useRNColorScheme();
	const [themePreference, setThemePreferenceState] =
		useState<ThemePreference>("system");
	const [isLoading, setIsLoading] = useState(true);

	// Load saved theme on mount
	useEffect(() => {
		async function loadTheme() {
			const savedTheme = await getThemePreference();
			setThemePreferenceState(savedTheme);
			setIsLoading(false);
		}
		loadTheme();
	}, []);

	// Determine actual color scheme based on preference
	const colorScheme: "light" | "dark" =
		themePreference === "system"
			? (systemColorScheme ?? "light")
			: themePreference;

	const isDarkColorScheme = colorScheme === "dark";

	const setTheme = useCallback(async (theme: ThemePreference) => {
		await setThemePreference(theme);
		setThemePreferenceState(theme);
	}, []);

	const toggleTheme = useCallback(async () => {
		const nextTheme: ThemePreference =
			themePreference === "light"
				? "dark"
				: themePreference === "dark"
					? "system"
					: "light";
		await setTheme(nextTheme);
	}, [themePreference]);

	if (isLoading) {
		return null;
	}

	return (
		<ThemeContext.Provider
			value={{
				colorScheme,
				themePreference,
				isDarkColorScheme,
				setTheme,
				toggleTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useColorScheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useColorScheme must be used within a ThemeProvider");
	}
	return context;
}
