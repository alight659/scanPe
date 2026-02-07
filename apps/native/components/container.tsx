import type React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme-provider";

export function Container({ children }: { children: React.ReactNode }) {
	const { colorScheme } = useColorScheme();
	const backgroundColor =
		colorScheme === "dark"
			? NAV_THEME.dark.background
			: NAV_THEME.light.background;

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor }}>
			{children}
		</SafeAreaView>
	);
}
