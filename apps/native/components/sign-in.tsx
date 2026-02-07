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

function SignIn() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const [form, setForm] = useState({ email: "", password: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function handleFormChange(field: "email" | "password", value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function handleLogin() {
		setIsLoading(true);
		setError(null);

		await authClient.signIn.email(
			{
				email: form.email,
				password: form.password,
			},
			{
				onError(error) {
					setError(error.error?.message || "Failed to sign in");
					setIsLoading(false);
				},
				onSuccess() {
					setForm({ email: "", password: "" });
				},
				onFinished() {
					setIsLoading(false);
				},
			},
		);
	}

	return (
		<View
			className="mt-4 border p-4"
			style={{
				backgroundColor: theme.card,
				borderColor: theme.border,
			}}
		>
			<Text className="mb-3 font-bold text-lg" style={{ color: theme.text }}>
				Sign In
			</Text>

			{error ? (
				<View>
					<Text className="text-sm" style={{ color: theme.notification }}>
						{error}
					</Text>
				</View>
			) : null}

			<TextInput
				className="mb-3 border p-3 text-base"
				style={{
					color: theme.text,
					borderColor: theme.border,
					backgroundColor: theme.background,
				}}
				placeholder="Email"
				placeholderTextColor={theme.text}
				value={form.email}
				onChangeText={(value) => handleFormChange("email", value)}
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
				value={form.password}
				onChangeText={(value) => handleFormChange("password", value)}
				secureTextEntry
			/>

			<TouchableOpacity
				onPress={handleLogin}
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
					<Text className="text-base text-white">Sign In</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

export { SignIn };
