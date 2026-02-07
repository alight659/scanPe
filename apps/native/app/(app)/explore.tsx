import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Explore() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text }]}>Explore</Text>
					<Text style={[styles.subtitle, { color: theme.text, opacity: 0.7 }]}>
						Discover more features and content
					</Text>

					<View
						style={[
							styles.card,
							{ backgroundColor: theme.card, borderColor: theme.border },
						]}
					>
						<Text style={[styles.cardTitle, { color: theme.text }]}>
							Coming Soon
						</Text>
						<Text
							style={[styles.cardText, { color: theme.text, opacity: 0.7 }]}
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

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		padding: 16,
	},
	content: {
		paddingVertical: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 24,
	},
	card: {
		padding: 16,
		borderWidth: 1,
		borderRadius: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	cardText: {
		fontSize: 14,
		lineHeight: 20,
	},
});
