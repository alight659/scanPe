import { ScrollView, StyleSheet, Text, View } from "react-native";

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
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text }]}>scanPe</Text>
					<Text style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}>
						Welcome to your personal dashboard
					</Text>

					{session?.user ? (
						<View
							style={[
								styles.userCard,
								{ backgroundColor: theme.card, borderColor: theme.border },
							]}
						>
							<Text style={[styles.welcomeText, { color: theme.text }]}>
								Welcome back,{" "}
								<Text style={styles.userName}>{session.user.name}</Text>!
							</Text>
							<Text
								style={[styles.userEmail, { color: theme.text, opacity: 0.7 }]}
							>
								{session.user.email}
							</Text>
						</View>
					) : null}

					<View
						style={[
							styles.infoCard,
							{ backgroundColor: theme.card, borderColor: theme.border },
						]}
					>
						<Text style={[styles.infoTitle, { color: theme.text }]}>
							Getting Started
						</Text>
						<Text
							style={[styles.infoText, { color: theme.text, opacity: 0.7 }]}
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

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 24,
	},
	userCard: {
		marginBottom: 16,
		padding: 16,
		borderWidth: 1,
		borderRadius: 8,
	},
	welcomeText: {
		fontSize: 18,
		marginBottom: 4,
	},
	userName: {
		fontWeight: "bold",
	},
	userEmail: {
		fontSize: 14,
	},
	infoCard: {
		padding: 16,
		borderWidth: 1,
		borderRadius: 8,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
	},
	infoText: {
		fontSize: 14,
		lineHeight: 20,
	},
});
