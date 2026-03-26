import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
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
import { useBudgets } from "@/lib/api/budgets";
import { useTransactions } from "@/lib/api/transactions";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";
import { DEFAULT_AVATAR } from "./profile";

export default function Home() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { data: session } = authClient.useSession();
	const { t } = useI18n();
	const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("daily");

	// Get actual user data from session
	const userName = session?.user?.name || "User";
	const userImage = session?.user?.image || DEFAULT_AVATAR;

	// Fetch real budget data from API
	const { data: budgets } = useBudgets();

	// Fetch real transactions from API
	const { data: allTransactions, isLoading: transactionsLoading } =
		useTransactions();

	// Get recent 5 transactions
	const recentTransactions = allTransactions?.slice(0, 5) || [];

	// Calculate totals for the selected period across all categories
	const periodBudgets = budgets?.filter((b) => b.period === period) || [];
	const totalSpent = periodBudgets.reduce((sum, b) => sum + b.spent, 0);
	const totalLimit = periodBudgets.reduce((sum, b) => sum + b.limit, 0);

	// Get current budget based on selected period, fallback to defaults if no budget exists
	const currentBudget =
		totalLimit > 0
			? { spent: totalSpent, total: totalLimit }
			: { spent: 0, total: 100 };
	const percentage =
		currentBudget.total > 0
			? Math.round((currentBudget.spent / currentBudget.total) * 100)
			: 0;

	// Get greeting based on local time
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return t("home.goodMorning");
		if (hour < 18) return t("home.goodAfternoon");
		return t("home.goodEvening");
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
							{t("home.recentActivity")}
						</Text>
						<TouchableOpacity
							onPress={() => router.push("/(app)/transactions")}
						>
							<Text className="font-medium text-emerald-500">
								{t("home.viewAll")}
							</Text>
						</TouchableOpacity>
					</View>

					{/* Loading State */}
					{transactionsLoading && (
						<View className="items-center justify-center py-8">
							<ActivityIndicator size="small" color="#10B981" />
						</View>
					)}

					{/* Transaction List */}
					{!transactionsLoading && recentTransactions.length > 0 && (
						<FlatList
							data={recentTransactions}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TransactionItem transaction={item} isDark={isDark} />
							)}
							scrollEnabled={false}
						/>
					)}

					{/* Empty State */}
					{!transactionsLoading && recentTransactions.length === 0 && (
						<View className="items-center justify-center py-8">
							<View
								className={`mb-3 rounded-full p-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
							>
								<Feather
									name="inbox"
									size={32}
									color={isDark ? "#6B7280" : "#9CA3AF"}
								/>
							</View>
							<Text
								className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
