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

function SignUp() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
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

				{/* Name Input */}
				<View className="mb-4">
					<Text
						className={`mb-2 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
					>
						Full Name
					</Text>
					<TextInput
						className={`rounded-xl border-2 px-4 py-3.5 text-base ${isDark ? "border-gray-700 bg-gray-800/50 text-white" : "border-gray-200 bg-gray-50 text-gray-900"}`}
						placeholder="Enter your full name"
						placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
						value={name}
						onChangeText={setName}
						autoComplete="name"
					/>
				</View>

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
						value={email}
						onChangeText={setEmail}
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
						placeholder="Create a strong password"
						placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoComplete="password-new"
					/>
				</View>

				{/* Sign Up Button */}
				<TouchableOpacity
					onPress={handleSignUp}
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
							Create Account
						</Text>
					)}
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

export { SignUp };
