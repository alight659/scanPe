import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { type ThemePreference, useColorScheme } from "@/lib/theme-provider";

export const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/lego/0.jpg";

export default function ProfileScreen() {
	const { colorScheme, themePreference, isDarkColorScheme, setTheme } =
		useColorScheme();
	const { data: session } = authClient.useSession();
	const [showThemeModal, setShowThemeModal] = useState(false);

	// Get actual user data from session
	const userName = session?.user?.name || "User";
	const userEmail = session?.user?.email || "user@example.com";
	const userImage = session?.user?.image || DEFAULT_AVATAR;

	const handleThemeChange = async (theme: ThemePreference) => {
		await setTheme(theme);
		setShowThemeModal(false);
	};

	const getThemeLabel = (theme: ThemePreference) => {
		switch (theme) {
			case "light":
				return "Light";
			case "dark":
				return "Dark";
			case "system":
				return "System Default";
		}
	};

	return (
		<Container>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header with back button */}
				<View className="flex-row items-center justify-between p-6">
					<TouchableOpacity
						onPress={() => router.back()}
						className={`rounded-full p-2 ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}
					>
						<Feather
							name="arrow-left"
							size={24}
							color={isDarkColorScheme ? "#fff" : "#111827"}
						/>
					</TouchableOpacity>
					<Text
						className={`font-bold text-xl ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
					>
						Profile
					</Text>
					<View className="w-10" />
				</View>

				{/* Profile Info */}
				<View className="items-center px-6 pb-8">
					{/* Profile Image */}
					<View className="mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-500">
						<Image
							source={{ uri: userImage }}
							style={{ width: 112, height: 112 }}
							contentFit="cover"
						/>
					</View>

					{/* User Name */}
					<Text
						className={`font-bold text-2xl ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
					>
						{userName}
					</Text>

					{/* User Email */}
					<Text
						className={`mt-1 text-base ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}
					>
						{userEmail}
					</Text>

					{/* Edit Profile Button */}
					<TouchableOpacity
						className="mt-6 rounded-xl bg-emerald-500 px-8 py-3"
						style={{
							shadowColor: "#10B981",
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.3,
							shadowRadius: 8,
							elevation: 5,
						}}
					>
						<Text className="font-semibold text-white">Edit Profile</Text>
					</TouchableOpacity>
				</View>

				{/* Menu Items */}
				<View className="px-6">
					{/* Account Section */}
					<Text
						className={`mb-3 font-semibold text-sm uppercase ${isDarkColorScheme ? "text-gray-500" : "text-gray-400"}`}
					>
						Account
					</Text>

					<View
						className={`mb-6 rounded-2xl border ${isDarkColorScheme ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
					>
						<MenuItem
							icon="credit-card"
							title="Payment Methods"
							isDark={isDarkColorScheme}
						/>
						<MenuItem
							icon="bell"
							title="Notifications"
							isDark={isDarkColorScheme}
							isLast
						/>
					</View>

					{/* Preferences Section */}
					<Text
						className={`mb-3 font-semibold text-sm uppercase ${isDarkColorScheme ? "text-gray-500" : "text-gray-400"}`}
					>
						Preferences
					</Text>

					<View
						className={`mb-6 rounded-2xl border ${isDarkColorScheme ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
					>
						{/* Theme Selection */}
						<TouchableOpacity
							onPress={() => setShowThemeModal(true)}
							className={`flex-row items-center justify-between px-4 py-4 ${isDarkColorScheme ? "border-gray-800 border-b" : "border-gray-100 border-b"}`}
						>
							<View className="flex-row items-center">
								<View
									className={`mr-3 rounded-full p-2 ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}
								>
									<Feather
										name="moon"
										size={20}
										color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
									/>
								</View>
								<Text
									className={`font-medium ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
								>
									Theme
								</Text>
							</View>
							<View className="flex-row items-center">
								<Text
									className={`mr-2 text-sm ${isDarkColorScheme ? "text-gray-500" : "text-gray-400"}`}
								>
									{getThemeLabel(themePreference)}
								</Text>
								<Feather
									name="chevron-right"
									size={20}
									color={isDarkColorScheme ? "#6B7280" : "#9CA3AF"}
								/>
							</View>
						</TouchableOpacity>

						<MenuItem
							icon="globe"
							title="Language"
							subtitle="English"
							isDark={isDarkColorScheme}
						/>
						<MenuItem
							icon="help-circle"
							title="Help & Support"
							isDark={isDarkColorScheme}
							isLast
						/>
					</View>

					{/* Logout Button */}
					<TouchableOpacity
						onPress={() => authClient.signOut()}
						className={
							"mb-8 flex-row items-center justify-center rounded-xl border-2 border-red-500 py-4"
						}
					>
						<Feather name="log-out" size={20} color="#EF4444" />
						<Text className="ml-2 font-semibold text-red-500">Sign Out</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Theme Selection Modal */}
			<Modal
				visible={showThemeModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowThemeModal(false)}
			>
				<View className="flex-1 justify-end bg-black/50">
					<View
						className={`rounded-t-3xl p-6 ${isDarkColorScheme ? "bg-gray-900" : "bg-white"}`}
					>
						<View className="mb-6 flex-row items-center justify-between">
							<Text
								className={`font-bold text-xl ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
							>
								Choose Theme
							</Text>
							<TouchableOpacity onPress={() => setShowThemeModal(false)}>
								<Feather
									name="x"
									size={24}
									color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
								/>
							</TouchableOpacity>
						</View>

						{/* Light Theme Option */}
						<TouchableOpacity
							onPress={() => handleThemeChange("light")}
							className={`mb-3 flex-row items-center rounded-xl border-2 p-4 ${
								themePreference === "light"
									? "border-emerald-500 bg-emerald-50"
									: isDarkColorScheme
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
							}`}
						>
							<View
								className={`mr-4 rounded-full p-3 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-100"}`}
							>
								<Feather name="sun" size={24} color="#F59E0B" />
							</View>
							<View className="flex-1">
								<Text
									className={`font-semibold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
								>
									Light
								</Text>
								<Text
									className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}
								>
									Always use light mode
								</Text>
							</View>
							{themePreference === "light" && (
								<Feather name="check" size={24} color="#10B981" />
							)}
						</TouchableOpacity>

						{/* Dark Theme Option */}
						<TouchableOpacity
							onPress={() => handleThemeChange("dark")}
							className={`mb-3 flex-row items-center rounded-xl border-2 p-4 ${
								themePreference === "dark"
									? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
									: isDarkColorScheme
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
							}`}
						>
							<View
								className={`mr-4 rounded-full p-3 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-100"}`}
							>
								<Feather name="moon" size={24} color="#6366F1" />
							</View>
							<View className="flex-1">
								<Text
									className={`font-semibold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
								>
									Dark
								</Text>
								<Text
									className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}
								>
									Always use dark mode
								</Text>
							</View>
							{themePreference === "dark" && (
								<Feather name="check" size={24} color="#10B981" />
							)}
						</TouchableOpacity>

						{/* System Theme Option */}
						<TouchableOpacity
							onPress={() => handleThemeChange("system")}
							className={`flex-row items-center rounded-xl border-2 p-4 ${
								themePreference === "system"
									? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
									: isDarkColorScheme
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
							}`}
						>
							<View
								className={`mr-4 rounded-full p-3 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-100"}`}
							>
								<Feather name="smartphone" size={24} color="#10B981" />
							</View>
							<View className="flex-1">
								<Text
									className={`font-semibold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
								>
									System Default
								</Text>
								<Text
									className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}
								>
									Follow system settings
								</Text>
							</View>
							{themePreference === "system" && (
								<Feather name="check" size={24} color="#10B981" />
							)}
						</TouchableOpacity>

						<View className="h-6" />
					</View>
				</View>
			</Modal>
		</Container>
	);
}

interface MenuItemProps {
	icon: string;
	title: string;
	subtitle?: string;
	isDark: boolean;
	isLast?: boolean;
}

function MenuItem({ icon, title, subtitle, isDark, isLast }: MenuItemProps) {
	return (
		<TouchableOpacity
			className={`flex-row items-center justify-between px-4 py-4 ${!isLast ? (isDark ? "border-gray-800 border-b" : "border-gray-100 border-b") : ""}`}
		>
			<View className="flex-row items-center">
				<View
					className={`mr-3 rounded-full p-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
				>
					<Feather
						name={icon as any}
						size={20}
						color={isDark ? "#9CA3AF" : "#6B7280"}
					/>
				</View>
				<Text
					className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
				>
					{title}
				</Text>
			</View>
			<View className="flex-row items-center">
				{subtitle && (
					<Text
						className={`mr-2 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
					>
						{subtitle}
					</Text>
				)}
				<Feather
					name="chevron-right"
					size={20}
					color={isDark ? "#6B7280" : "#9CA3AF"}
				/>
			</View>
		</TouchableOpacity>
	);
}
