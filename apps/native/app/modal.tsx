import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Modal() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Container>
			<View className="flex-1 p-4">
				<View className="mb-4">
					<Text className="font-bold text-xl" style={{ color: theme.text }}>
						Modal
					</Text>
				</View>
			</View>
		</Container>
	);
}
