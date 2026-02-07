import { useState } from "react";
import {
	ActivityIndicator,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

function SignUp() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSignUp() {
		setIsLoading(true);
		setError(null);

		try {
			await authClient.signUp.email(
				{
					name,
					email,
					password,
				},
				{
					onError(error) {
						console.log("error.....", error);
						setError(error.error?.message || "Failed to sign up");
						setIsLoading(false);
					},
					onSuccess() {
						console.log("success.....");
						setName("");
						setEmail("");
						setPassword("");
					},
					onFinished() {
						console.log("finished.....");
						setIsLoading(false);
					},
				},
			);
		} catch (e) {
			console.log("Error is: ", e);
		}
	}

	return (
		<View
			className="mt-4 border p-4"
			style={{
				backgroundColor: theme.card,
				borderColor: theme.border,
			}}
		>
			{error ? (
				<View>
					<Text className="text-sm text-white">{error}</Text>
				</View>
			) : null}

			<TextInput
				className="mb-3 border p-3 text-base"
				style={{
					color: theme.text,
					borderColor: theme.border,
					backgroundColor: theme.background,
				}}
				placeholder="Name"
				placeholderTextColor={theme.text}
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				className="mb-3 border p-3 text-base"
				style={{
					color: theme.text,
					borderColor: theme.border,
					backgroundColor: theme.background,
				}}
				placeholder="Email"
				placeholderTextColor={theme.text}
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<TextInput
				className="mb-3 border p-3 text-base"
				style={{
					color: theme.text,
					borderColor: theme.border,
					backgroundColor: theme.background,
				}}
				placeholder="Password"
				placeholderTextColor={theme.text}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				onPress={handleSignUp}
				disabled={isLoading}
				className="items-center justify-center p-3"
				style={{
					backgroundColor: theme.primary,
					opacity: isLoading ? 0.5 : 1,
				}}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#ffffff" />
				) : (
					<Text className="text-base text-white">Sign Up</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

export { SignUp };
