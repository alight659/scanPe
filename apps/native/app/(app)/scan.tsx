import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/theme-provider";

export default function ScanScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<Container>
			<View className="flex-1 items-center justify-center p-6">
				<View
					className={`mb-6 rounded-full p-8 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
				>
					<Text className="text-4xl">📷</Text>
				</View>
				<Text
					className={`mb-2 text-center font-bold text-2xl ${isDark ? "text-white" : "text-gray-900"}`}
				>
					Scan QR Code
				</Text>
				<Text
					className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
				>
					Point your camera at a QR code to scan and make payments
				</Text>
			</View>
		</Container>
	);
}
