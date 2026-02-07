import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Profile() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session } = authClient.useSession();

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="p-4">
					<Text
						className="mb-6 font-bold text-[28px]"
						style={{ color: theme.text }}
					>
						Profile
					</Text>

					{session?.user ? (
						<>
							<View
								className="mb-6 rounded-lg border p-4"
								style={{
									backgroundColor: theme.card,
									borderColor: theme.border,
								}}
							>
								<View className="mb-4">
									<Text
										className="mb-1 text-xs uppercase tracking-wider"
										style={{ color: theme.text, opacity: 0.7 }}
									>
										Name
									</Text>
									<Text
										className="font-medium text-base"
										style={{ color: theme.text }}
									>
										{session.user.name}
									</Text>
								</View>

								<View>
									<Text
										className="mb-1 text-xs uppercase tracking-wider"
										style={{ color: theme.text, opacity: 0.7 }}
									>
										Email
									</Text>
									<Text
										className="font-medium text-base"
										style={{ color: theme.text }}
									>
										{session.user.email}
									</Text>
								</View>
							</View>

							<TouchableOpacity
								className="items-center rounded-lg p-4"
								style={{ backgroundColor: theme.notification }}
								onPress={() => {
									authClient.signOut();
								}}
							>
								<Text className="font-semibold text-base text-white">
									Sign Out
								</Text>
							</TouchableOpacity>
						</>
					) : null}
				</View>
			</ScrollView>
		</Container>
	);
}
