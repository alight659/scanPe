import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function NotFoundScreen() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Container>
				<View className="flex-1 items-center justify-center p-4">
					<View className="items-center">
						<Text className="mb-4 text-5xl">🤔</Text>
						<Text
							className="mb-2 text-center font-bold text-xl"
							style={{ color: theme.text }}
						>
							Page Not Found
						</Text>
						<Text
							className="mb-6 text-center text-sm"
							style={{ color: theme.text, opacity: 0.7 }}
						>
							Sorry, the page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Text
								className="p-3"
								style={{
									color: theme.primary,
									backgroundColor: `${theme.primary}1a`,
								}}
							>
								Go to Home
							</Text>
						</Link>
					</View>
				</View>
			</Container>
		</>
	);
}
