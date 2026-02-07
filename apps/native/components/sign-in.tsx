import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/theme-provider";

function SignIn() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
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
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="w-full"
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
		>
			<ScrollView
				className="w-full"
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				{/* Error Message */}
				{error ? (
					<View
						className={`mb-4 rounded-xl border-l-4 p-4 ${isDark ? "border-red-500 bg-red-500/10" : "border-red-500 bg-red-50"}`}
					>
						<Text
							className={`font-medium text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
						>
							{error}
						</Text>
					</View>
				) : null}

				{/* Email Input */}
				<View className="mb-4">
					<Text
						className={`mb-2 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
					>
						Email Address
					</Text>
					<TextInput
						className={`rounded-xl border-2 px-4 py-3.5 text-base ${isDark ? "border-gray-700 bg-gray-800/50 text-white" : "border-gray-200 bg-gray-50 text-gray-900"}`}
						placeholder="Enter your email"
						placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
						value={form.email}
						onChangeText={(value) => handleFormChange("email", value)}
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
					/>
				</View>

				{/* Password Input */}
				<View className="mb-6">
					<Text
						className={`mb-2 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
					>
						Password
					</Text>
					<TextInput
						className={`rounded-xl border-2 px-4 py-3.5 text-base ${isDark ? "border-gray-700 bg-gray-800/50 text-white" : "border-gray-200 bg-gray-50 text-gray-900"}`}
						placeholder="Enter your password"
						placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
						value={form.password}
						onChangeText={(value) => handleFormChange("password", value)}
						secureTextEntry
						autoComplete="password"
					/>
				</View>

				{/* Sign In Button */}
				<TouchableOpacity
					onPress={handleLogin}
					disabled={isLoading}
					className={`rounded-xl py-4 ${isLoading ? "opacity-70" : "opacity-100"}`}
					style={{
						backgroundColor: "#6366f1",
						shadowColor: "#6366f1",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 8,
						elevation: 5,
					}}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<Text className="text-center font-bold text-base text-white">
							Sign In
						</Text>
					)}
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

export { SignIn };
