import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { Container } from "@/components/container";
import { TransactionItem } from "@/components/transaction-item";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";

// Extended mock transaction data
const allTransactions = [
	{
		id: "1",
		merchant: "Starbucks Reserve",
		category: "Coffee",
		amount: 12.5,
		time: "Today, 9:41 AM",
		date: "2025-01-07",
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
		date: "2025-01-06",
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
		date: "2025-01-06",
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
		date: "2025-01-05",
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
		date: "2025-01-04",
		icon: "package",
		iconColor: "#7C3AED",
		iconBgColor: "#EDE9FE",
	},
	{
		id: "6",
		merchant: "Shell Gas Station",
		category: "Transport",
		amount: 56.0,
		time: "Jan 4, 10:15 AM",
		date: "2025-01-04",
		icon: "droplet",
		iconColor: "#B45309",
		iconBgColor: "#FEF3C7",
	},
	{
		id: "7",
		merchant: "Chipotle",
		category: "Food",
		amount: 18.45,
		time: "Jan 3, 12:30 PM",
		date: "2025-01-03",
		icon: "shopping-bag",
		iconColor: "#DC2626",
		iconBgColor: "#FEE2E2",
	},
	{
		id: "8",
		merchant: "Spotify",
		category: "Entertainment",
		amount: 9.99,
		time: "Jan 2, 12:00 AM",
		date: "2025-01-02",
		icon: "music",
		iconColor: "#059669",
		iconBgColor: "#D1FAE5",
	},
	{
		id: "9",
		merchant: "Target",
		category: "Shopping",
		amount: 127.83,
		time: "Jan 1, 4:45 PM",
		date: "2025-01-01",
		icon: "shopping-cart",
		iconColor: "#DC2626",
		iconBgColor: "#FEE2E2",
	},
	{
		id: "10",
		merchant: "Electric Company",
		category: "Utilities",
		amount: 89.5,
		time: "Dec 31, 2024",
		date: "2024-12-31",
		icon: "zap",
		iconColor: "#F59E0B",
		iconBgColor: "#FEF3C7",
	},
	{
		id: "11",
		merchant: "Airbnb",
		category: "Travel",
		amount: 450.0,
		time: "Dec 28, 2024",
		date: "2024-12-28",
		icon: "home",
		iconColor: "#EC4899",
		iconBgColor: "#FCE7F3",
	},
	{
		id: "12",
		merchant: "Pharmacy",
		category: "Health",
		amount: 32.15,
		time: "Dec 27, 2024",
		date: "2024-12-27",
		icon: "plus-circle",
		iconColor: "#0891B2",
		iconBgColor: "#CFFAFE",
	},
];

export default function TransactionsScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();
	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

	// Calculate totals
	const totalSpent = allTransactions.reduce((sum, t) => sum + t.amount, 0);

	// Filter transactions based on search
	const filteredTransactions = allTransactions.filter((transaction) => {
		const matchesSearch =
			searchQuery === "" ||
			transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
			transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	// Group transactions by date
	const groupedTransactions = filteredTransactions.reduce(
		(groups, transaction) => {
			const date = transaction.date;
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(transaction);
			return groups;
		},
		{} as Record<string, typeof allTransactions>,
	);

	// Sort dates in descending order
	const sortedDates = Object.keys(groupedTransactions).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	);

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (dateStr === today.toISOString().split("T")[0]) {
			return t("transactions.today");
		}
		if (dateStr === yesterday.toISOString().split("T")[0]) {
			return t("transactions.yesterday");
		}
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<Container>
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

				<Text
					className={`font-bold text-lg ${
						isDark ? "text-white" : "text-gray-900"
					}`}
				>
					{t("transactions.allTransactions")}
				</Text>

				<View className="w-10" />
			</View>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Summary Card */}
				<View className="px-6 py-4">
					<View
						className={`rounded-2xl border p-6 ${
							isDark
								? "border-gray-800 bg-gray-900"
								: "border-gray-100 bg-white"
						}`}
					>
						<Text
							className={`mb-1 text-sm ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{t("transactions.totalSpent")}
						</Text>
						<Text
							className={`font-bold text-3xl ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							${totalSpent.toFixed(2)}
						</Text>
						<Text
							className={`mt-1 text-sm ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{allTransactions.length} {t("home.transactions")}
						</Text>
					</View>
				</View>

				{/* Search Bar */}
				<View className="px-6 pb-4">
					<View
						className={`flex-row items-center rounded-xl border-2 px-4 py-3 ${
							isDark
								? "border-gray-700 bg-gray-800"
								: "border-gray-200 bg-gray-50"
						}`}
					>
						<Feather
							name="search"
							size={20}
							color={isDark ? "#6B7280" : "#9CA3AF"}
						/>
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder={t("transactions.searchPlaceholder")}
							placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
							className={`ml-3 flex-1 text-base ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						/>
						{searchQuery !== "" && (
							<TouchableOpacity onPress={() => setSearchQuery("")}>
								<Feather
									name="x"
									size={20}
									color={isDark ? "#6B7280" : "#9CA3AF"}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Transactions List */}
				<View className="px-6">
					{sortedDates.map((date) => (
						<View key={date} className="mb-6">
							<Text
								className={`mb-3 font-semibold text-sm ${
									isDark ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{formatDate(date)}
							</Text>
							{groupedTransactions[date].map((transaction) => (
								<TransactionItem
									key={transaction.id}
									transaction={transaction}
									isDark={isDark}
								/>
							))}
						</View>
					))}

					{filteredTransactions.length === 0 && (
						<View className="items-center justify-center py-12">
							<Feather
								name="search"
								size={48}
								color={isDark ? "#374151" : "#D1D5DB"}
							/>
							<Text
								className={`mt-4 text-center ${
									isDark ? "text-gray-400" : "text-gray-500"
								}`}
							>
								{t("transactions.noTransactions")}
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</Container>
	);
}
