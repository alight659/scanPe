import * as SecureStore from "expo-secure-store";

const THEME_KEY = "user_theme_preference";

export type ThemePreference = "light" | "dark" | "system";

export async function getThemePreference(): Promise<ThemePreference> {
	try {
		const theme = await SecureStore.getItemAsync(THEME_KEY);
		if (theme === "light" || theme === "dark" || theme === "system") {
			return theme;
		}
		return "system";
	} catch {
		return "system";
	}
}

export async function setThemePreference(
	theme: ThemePreference,
): Promise<void> {
	try {
		await SecureStore.setItemAsync(THEME_KEY, theme);
	} catch (error) {
		console.error("Failed to save theme preference:", error);
	}
}

export async function clearThemePreference(): Promise<void> {
	try {
		await SecureStore.deleteItemAsync(THEME_KEY);
	} catch (error) {
		console.error("Failed to clear theme preference:", error);
	}
}
