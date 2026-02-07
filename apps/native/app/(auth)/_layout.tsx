import { Stack } from "expo-router";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

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
				name="login"
				options={{
					title: "Sign In",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="signup"
				options={{
					title: "Create Account",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
