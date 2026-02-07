import { Feather } from "@expo/vector-icons";
import { fetch as expoFetch } from "expo/fetch";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";

const SERVER_URL =
	process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

export default function SupportScreen() {
	const { isDarkColorScheme } = useColorScheme();
	const isDark = isDarkColorScheme;
	const { t } = useI18n();
	const flatListRef = useRef<FlatList<ChatMessage>>(null);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: "welcome",
			role: "assistant",
			content: t("support.welcomeMessage"),
		},
	]);

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		if (messages.length > 0 && flatListRef.current) {
			setTimeout(() => {
				flatListRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: input.trim(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await expoFetch(`${SERVER_URL}/ai`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Server error:", errorText);
				throw new Error(`Server error: ${response.status} - ${errorText}`);
			}

			const responseText = await response.text();
			let assistantContent = "";
			try {
				const parsed = JSON.parse(responseText);
				if (Array.isArray(parsed)) {
					const assistantMsg = parsed
						.reverse()
						.find((m: any) => m.role === "assistant");
					assistantContent =
						assistantMsg?.content ||
						assistantMsg?.parts?.[0]?.text ||
						"I received your message.";
				} else if (parsed.content) {
					assistantContent = parsed.content;
				} else {
					assistantContent = responseText;
				}
			} catch {
				assistantContent = responseText;
			}

			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: assistantContent,
				},
			]);
		} catch (error) {
			console.error("Chat error:", error);
			Alert.alert(t("common.error"), t("support.connectionError"), [
				{ text: "OK" },
			]);

			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					role: "assistant",
					content: t("support.serverError"),
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleQuickAction = (text: string) => {
		setInput(text);
	};

	const renderMessage = ({ item }: { item: ChatMessage }) => {
		const isUser = item.role === "user";

		return (
			<View
				className={`mb-4 flex-row ${isUser ? "justify-end" : "justify-start"}`}
			>
				{!isUser && (
					<View
						className={`mr-2 h-8 w-8 items-center justify-center rounded-full ${isDark ? "bg-emerald-600" : "bg-emerald-500"}`}
					>
						<Feather name="cpu" size={16} color="white" />
					</View>
				)}

				<View
					className={`max-w-[75%] rounded-2xl px-4 py-3 ${
						isUser
							? isDark
								? "bg-emerald-600"
								: "bg-emerald-500"
							: isDark
								? "bg-gray-800"
								: "bg-gray-100"
					}`}
				>
					<Text
						className={`text-base leading-5 ${
							isUser ? "text-white" : isDark ? "text-gray-100" : "text-gray-900"
						}`}
					>
						{item.content}
					</Text>
				</View>

				{isUser && (
					<View
						className={`ml-2 h-8 w-8 items-center justify-center rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
					>
						<Feather
							name="user"
							size={16}
							color={isDark ? "white" : "#374151"}
						/>
					</View>
				)}
			</View>
		);
	};

	return (
		<SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
			{/* Header */}
			<View
				className={`flex-row items-center justify-between border-b px-4 py-4 ${
					isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
				}`}
			>
				<TouchableOpacity
					onPress={() => router.back()}
					className={`rounded-full p-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
				>
					<Feather
						name="arrow-left"
						size={20}
						color={isDark ? "#fff" : "#111827"}
					/>
				</TouchableOpacity>

				<View className="flex-1 items-center">
					<Text
						className={`font-bold text-lg ${
							isDark ? "text-white" : "text-gray-900"
						}`}
					>
						{t("support.helpSupport")}
					</Text>
					<View className="mt-1 flex-row items-center">
						<View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
						<Text
							className={`text-xs ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{t("support.aiAssistant")}
						</Text>
					</View>
				</View>

				<View className="w-10" />
			</View>

			{/* Chat Messages */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<FlatList
					ref={flatListRef}
					data={messages}
					keyExtractor={(item) => item.id}
					renderItem={renderMessage}
					contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
					showsVerticalScrollIndicator={false}
				/>

				{/* Input Area */}
				<View
					className={`border-t px-4 py-3 ${
						isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
					}`}
				>
					<View className="flex-row items-center">
						<TextInput
							value={input}
							onChangeText={setInput}
							placeholder={t("support.askPlaceholder")}
							placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
							multiline
							maxLength={500}
							className={`mr-3 max-h-24 flex-1 rounded-xl border-2 px-4 py-3 text-base ${
								isDark
									? "border-gray-700 bg-gray-800 text-white"
									: "border-gray-200 bg-gray-50 text-gray-900"
							}`}
							style={{ minHeight: 48 }}
						/>

						<TouchableOpacity
							onPress={handleSend}
							disabled={!input.trim() || isLoading}
							className={`h-12 w-12 items-center justify-center rounded-full ${
								input.trim() && !isLoading
									? "bg-emerald-500"
									: isDark
										? "bg-gray-700"
										: "bg-gray-300"
							}`}
						>
							{isLoading ? (
								<ActivityIndicator size="small" color="white" />
							) : (
								<Feather name="send" size={20} color="white" />
							)}
						</TouchableOpacity>
					</View>

					{/* Quick Actions */}
					<View className="mt-3 flex-row">
						<QuickActionButton
							label={t("support.budgetHelp")}
							onPress={() => handleQuickAction("How do I set up my budget?")}
							isDark={isDark}
						/>
						<QuickActionButton
							label={t("support.qrIssues")}
							onPress={() => handleQuickAction("QR code won't scan")}
							isDark={isDark}
						/>
						<QuickActionButton
							label={t("support.spendingAlerts")}
							onPress={() => handleQuickAction("What are spending alerts?")}
							isDark={isDark}
						/>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

interface QuickActionButtonProps {
	label: string;
	onPress: () => void;
	isDark: boolean;
}

function QuickActionButton({ label, onPress, isDark }: QuickActionButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={`mr-2 rounded-full px-3 py-1.5 ${
				isDark ? "bg-gray-800" : "bg-gray-100"
			}`}
		>
			<Text className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
				{label}
			</Text>
		</TouchableOpacity>
	);
}
