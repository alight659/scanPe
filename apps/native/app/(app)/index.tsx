import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { BudgetChart } from "@/components/budget-chart";
import { Container } from "@/components/container";
import { SpendingAlert } from "@/components/spending-alert";
import { TransactionItem } from "@/components/transaction-item";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/theme-provider";
import { DEFAULT_AVATAR } from "./profile";

// Mock transaction data
const transactions = [
	{
		id: "1",
		merchant: "Starbucks Reserve",
		category: "Coffee",
		amount: 12.5,
		time: "Today, 9:41 AM",
		icon: "coffee",
		iconColor: "#92400E",
		iconBgColor: "#FEF3C7",
	},
	{
		id: "2",
		merchant: "Whole Foods Market",
		category: "Groceries",
		amount: 84.2,
		time: "Yesterday, 6:30 PM",
		icon: "shopping-bag",
		iconColor: "#065F46",
		iconBgColor: "#D1FAE5",
	},
	{
		id: "3",
		merchant: "Uber",
		category: "Transport",
		amount: 24.0,
		time: "Yesterday, 8:15 AM",
		icon: "navigation",
		iconColor: "#1E40AF",
		iconBgColor: "#DBEAFE",
	},
	{
		id: "4",
		merchant: "Netflix",
		category: "Entertainment",
		amount: 15.99,
		time: "Jan 5, 8:00 PM",
		icon: "film",
		iconColor: "#991B1B",
		iconBgColor: "#FEE2E2",
	},
	{
		id: "5",
		merchant: "Amazon",
		category: "Shopping",
		amount: 45.67,
		time: "Jan 4, 3:20 PM",
		icon: "package",
		iconColor: "#7C3AED",
		iconBgColor: "#EDE9FE",
	},
];

export default function Home() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { data: session } = authClient.useSession();
	const [period, setPeriod] = useState<"daily" | "monthly">("daily");

	// Get actual user data from session
	const userName = session?.user?.name || "User";
	const userImage = session?.user?.image || DEFAULT_AVATAR;

	// Mock budget data
	const budgetData = {
		daily: { spent: 68, total: 100 },
		monthly: { spent: 1200, total: 2000 },
	};

	const currentBudget = budgetData[period];
	const percentage = Math.round(
		(currentBudget.spent / currentBudget.total) * 100,
	);

	// Get greeting based on local time
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	return (
		<Container>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Header Section */}
				<View className="flex-row items-center justify-between p-6 pb-4">
					<View>
						<Text
							className={`text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							{getGreeting()},
						</Text>
						<Text
							className={`font-bold text-2xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							{userName}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => router.push("/(app)/profile")}
						className="h-12 w-12 overflow-hidden rounded-full border-2 border-emerald-500"
					>
						<Image
							source={{
								uri: userImage,
							}}
							style={{ width: 48, height: 48 }}
							contentFit="cover"
						/>
					</TouchableOpacity>
				</View>

				{/* Budget Circle Chart */}
				<View className="items-center px-6 py-4">
					<BudgetChart
						spent={currentBudget.spent}
						total={currentBudget.total}
						period={period}
						onPeriodChange={setPeriod}
						isDark={isDark}
					/>
				</View>

				{/* Spending Alert */}
				<SpendingAlert percentage={percentage} isDark={isDark} />

				{/* Recent Activity Section */}
				<View className="px-6">
					{/* Section Header */}
					<View className="mb-4 flex-row items-center justify-between">
						<Text
							className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							Recent Activity
						</Text>
						<TouchableOpacity>
							<Text className="font-medium text-emerald-500">View All</Text>
						</TouchableOpacity>
					</View>

					{/* Transaction List */}
					<FlatList
						data={transactions}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TransactionItem transaction={item} isDark={isDark} />
						)}
						scrollEnabled={false}
					/>
				</View>
			</ScrollView>
		</Container>
	);
}
