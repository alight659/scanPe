import { Stack } from "expo-router";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme-provider";

export default function AuthLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.background,
				},
				headerTitleStyle: {
					color: theme.text,
				},
				headerTintColor: theme.text,
				contentStyle: {
					backgroundColor: theme.background,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Auth",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
