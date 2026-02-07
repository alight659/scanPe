import { Link, Redirect } from "expo-router";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { Container } from "@/components/container";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Signup() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session } = authClient.useSession();

	if (session?.user) {
		return <Redirect href="/(app)" />;
	}

	return (
		<Container>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
			>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text style={[styles.title, { color: theme.text }]}>scanPe</Text>
						<Text
							style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}
						>
							Create an account to get started.
						</Text>
					</View>

					<SignUp />

					<View style={styles.footer}>
						<Text style={[styles.footerText, { color: theme.text }]}>
							Already have an account?{" "}
						</Text>
						<Link href="/(auth)/login" asChild>
							<TouchableOpacity>
								<Text style={[styles.footerLink, { color: theme.primary }]}>
									Log In
								</Text>
							</TouchableOpacity>
						</Link>
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
	contentContainer: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	header: {
		marginBottom: 32,
		alignItems: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
	},
	footerText: {
		fontSize: 14,
	},
	footerLink: {
		fontSize: 14,
		fontWeight: "600",
	},
});
