import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

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
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text }]}>Profile</Text>

					{session?.user ? (
						<>
							<View
								style={[
									styles.userCard,
									{ backgroundColor: theme.card, borderColor: theme.border },
								]}
							>
								<View style={styles.userInfo}>
									<Text
										style={[styles.label, { color: theme.text, opacity: 0.7 }]}
									>
										Name
									</Text>
									<Text style={[styles.value, { color: theme.text }]}>
										{session.user.name}
									</Text>
								</View>

								<View style={styles.userInfo}>
									<Text
										style={[styles.label, { color: theme.text, opacity: 0.7 }]}
									>
										Email
									</Text>
									<Text style={[styles.value, { color: theme.text }]}>
										{session.user.email}
									</Text>
								</View>
							</View>

							<TouchableOpacity
								style={[
									styles.signOutButton,
									{ backgroundColor: theme.notification },
								]}
								onPress={() => {
									authClient.signOut();
								}}
							>
								<Text style={styles.signOutText}>Sign Out</Text>
							</TouchableOpacity>
						</>
					) : null}
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
		marginBottom: 24,
		color: "#000",
	},
	userCard: {
		marginBottom: 24,
		padding: 16,
		borderWidth: 1,
		borderRadius: 8,
	},
	userInfo: {
		marginBottom: 16,
	},
	label: {
		fontSize: 12,
		marginBottom: 4,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	value: {
		fontSize: 16,
		fontWeight: "500",
	},
	signOutButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	signOutText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
});
