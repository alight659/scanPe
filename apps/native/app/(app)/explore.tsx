import { ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Explore() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Container>
			<ScrollView className="flex-1 p-4">
				<View className="py-4">
					<Text
						className="mb-2 font-bold text-2xl"
						style={{ color: theme.text }}
					>
						Explore
					</Text>
					<Text
						className="mb-6 text-base"
						style={{ color: theme.text, opacity: 0.7 }}
					>
						Discover more features and content
					</Text>

					<View
						className="rounded-lg border p-4"
						style={{
							backgroundColor: theme.card,
							borderColor: theme.border,
						}}
					>
						<Text
							className="mb-2 font-bold text-lg"
							style={{ color: theme.text }}
						>
							Coming Soon
						</Text>
						<Text
							className="text-sm leading-5"
							style={{ color: theme.text, opacity: 0.7 }}
						>
							This section will contain exciting features and content. Stay
							tuned for updates!
						</Text>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
