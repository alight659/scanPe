import "@/polyfills";
import "../global.css";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
	type Theme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { NAV_THEME } from "@/lib/constants";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { ThemeProvider, useColorScheme } from "@/lib/theme-provider";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export const unstable_settings = {
	initialRouteName: "(auth)",
};

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

function RootLayoutNav() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, [colorScheme]);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<NavigationThemeProvider
			value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
		>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			<GestureHandlerRootView className="flex-1">
				<Stack>
					<Stack.Screen name="(auth)" options={{ headerShown: false }} />
					<Stack.Screen name="(app)" options={{ headerShown: false }} />
					<Stack.Screen
						name="modal"
						options={{ title: "Modal", presentation: "modal" }}
					/>
				</Stack>
			</GestureHandlerRootView>
		</NavigationThemeProvider>
	);
}

export default function RootLayout() {
	return (
		<I18nProvider>
			<ThemeProvider>
				<RootLayoutNav />
			</ThemeProvider>
		</I18nProvider>
	);
}
