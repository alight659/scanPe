import { ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Home() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session } = authClient.useSession();

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="p-4">
					<Text
						className="mb-2 font-bold text-[28px]"
						style={{ color: theme.text }}
					>
						scanPe
					</Text>
					<Text
						className="mb-6 text-base"
						style={{ color: theme.text, opacity: 0.7 }}
					>
						Welcome to your personal dashboard
					</Text>

					{session?.user ? (
						<View
							className="mb-4 rounded-lg border p-4"
							style={{
								backgroundColor: theme.card,
								borderColor: theme.border,
							}}
						>
							<Text className="mb-1 text-lg" style={{ color: theme.text }}>
								Welcome back,{" "}
								<Text className="font-bold">{session.user.name}</Text>!
							</Text>
							<Text
								className="text-sm"
								style={{ color: theme.text, opacity: 0.7 }}
							>
								{session.user.email}
							</Text>
						</View>
					) : null}

					<View
						className="rounded-lg border p-4"
						style={{
							backgroundColor: theme.card,
							borderColor: theme.border,
						}}
					>
						<Text
							className="mb-2 font-bold text-base"
							style={{ color: theme.text }}
						>
							Getting Started
						</Text>
						<Text
							className="text-sm leading-5"
							style={{ color: theme.text, opacity: 0.7 }}
						>
							Use the tabs below to navigate through the app. Visit your Profile
							to manage your account.
						</Text>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
