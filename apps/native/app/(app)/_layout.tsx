import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme-provider";

export default function AppLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return null;
	}

	if (!session?.user) {
		return <Redirect href="/(auth)" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				headerStyle: {
					backgroundColor: theme.background,
				},
				headerTitleStyle: {
					color: theme.text,
				},
				headerTintColor: theme.text,
				tabBarActiveTintColor: "#10B981",
				tabBarInactiveTintColor: isDarkColorScheme ? "#6B7280" : "#9CA3AF",
				tabBarStyle: {
					backgroundColor: theme.background,
					borderTopColor: theme.border,
					height: 80,
					paddingBottom: 20,
					paddingTop: 10,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Feather name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					title: "",
					tabBarIcon: ({ size }) => (
						<View
							style={{
								width: 56,
								height: 56,
								borderRadius: 28,
								backgroundColor: "#10B981",
								justifyContent: "center",
								alignItems: "center",
								marginTop: -30,
								shadowColor: "#10B981",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.3,
								shadowRadius: 8,
								elevation: 8,
								borderWidth: 4,
								borderColor: theme.background,
							}}
						>
							<Feather name="maximize" size={24} color="white" />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="budgets"
				options={{
					title: "Budgets",
					tabBarIcon: ({ color, size }) => (
						<Feather name="credit-card" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
