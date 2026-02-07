import { Redirect, Tabs } from "expo-router";

import { TabBarIcon } from "@/components/tabbar-icon";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function AppLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return null;
	}

	if (!session?.user) {
		return <Redirect href="/(auth)/login" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.background,
				},
				headerTitleStyle: {
					color: theme.text,
				},
				headerTintColor: theme.text,
				tabBarActiveTintColor: theme.primary,
				tabBarInactiveTintColor: theme.text,
				tabBarStyle: {
					backgroundColor: theme.background,
					borderTopColor: theme.border,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="compass" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
