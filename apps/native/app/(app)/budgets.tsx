import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { AddBudgetModal } from "@/components/add-budget-modal";
import { Container } from "@/components/container";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
	useBudgets,
	useCreateBudget,
	useDeleteBudget,
	useUpdateBudget,
} from "@/lib/api/budgets";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";
import type { Budget, Period } from "@/types/budget";

export default function BudgetsScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();

	const [showModal, setShowModal] = useState(false);
	const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
	const [selectedPeriod, setSelectedPeriod] = useState<Period | "all">("all");

	const [menuVisible, setMenuVisible] = useState<string | null>(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

	const { data: budgets, isLoading, error } = useBudgets();
	const createBudget = useCreateBudget();
	const updateBudget = useUpdateBudget();
	const deleteBudget = useDeleteBudget();

	const handleAddPress = () => {
		setEditingBudget(undefined);
		setShowModal(true);
	};

	const handleEditPress = (budget: Budget) => {
		setMenuVisible(null);
		setEditingBudget(budget);
		setShowModal(true);
	};

	const handleDeletePress = (budget: Budget) => {
		setMenuVisible(null);
		setBudgetToDelete(budget);
		setDeleteModalVisible(true);
	};

	const handleConfirmDelete = () => {
		if (budgetToDelete) {
			deleteBudget.mutate(budgetToDelete.id, {
				onSuccess: () => {
					setDeleteModalVisible(false);
					setBudgetToDelete(null);
				},
				onError: (err) => {
					Alert.alert(t("common.error"), err.message);
					setDeleteModalVisible(false);
					setBudgetToDelete(null);
				},
			});
		}
	};

	const handleMenuPress = (budgetId: string) => {
		setMenuVisible(menuVisible === budgetId ? null : budgetId);
	};

	const handleSubmit = (data: {
		categoryId: string;
		limit: number;
		period: Period;
		strictMode: boolean;
	}) => {
		if (editingBudget) {
			updateBudget.mutate(
				{ id: editingBudget.id, input: data },
				{
					onSuccess: () => {
						setShowModal(false);
						setEditingBudget(undefined);
					},
					onError: (err) => {
						Alert.alert(t("common.error"), err.message);
					},
				},
			);
		} else {
			createBudget.mutate(data, {
				onSuccess: () => {
					setShowModal(false);
				},
				onError: (err) => {
					Alert.alert(t("common.error"), err.message);
				},
			});
		}
	};

	const getPeriodLabel = (period: Period) => {
		switch (period) {
			case "daily":
				return t("budget.daily");
			case "monthly":
				return t("budget.monthly");
			case "yearly":
				return t("budget.yearly");
		}
	};

	const getProgressPercentage = (spent: number, limit: number) => {
		if (limit === 0) return 0;
		return Math.min((spent / limit) * 100, 100);
	};

	const getProgressColor = (percentage: number) => {
		if (percentage >= 90) return "bg-red-500";
		if (percentage >= 60) return "bg-orange-500";
		return "bg-emerald-500";
	};

	// Filter budgets by selected period
	const filteredBudgets =
		selectedPeriod === "all"
			? budgets
			: budgets?.filter((b) => b.period === selectedPeriod);

	// Group budgets by period for display
	const groupedBudgets = filteredBudgets?.reduce(
		(acc, budget) => {
			if (!acc[budget.period]) acc[budget.period] = [];
			acc[budget.period].push(budget);
			return acc;
		},
		{} as Record<Period, Budget[]>,
	);

	return (
		<Container>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="p-6">
					{/* Header */}
					<View className="mb-6 flex-row items-center justify-between">
						<Text
							className={`font-bold text-3xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							{t("budget.budgets")}
						</Text>
						<TouchableOpacity
							onPress={handleAddPress}
							className="rounded-full bg-emerald-500 p-3"
							style={{
								shadowColor: "#10B981",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.3,
								shadowRadius: 8,
								elevation: 5,
							}}
						>
							<Feather name="plus" size={24} color="#FFFFFF" />
						</TouchableOpacity>
					</View>

					{/* Period Filter */}
					<View className="mb-6 flex-row">
						{(["all", "daily", "monthly", "yearly"] as const).map((period) => (
							<TouchableOpacity
								key={period}
								onPress={() => setSelectedPeriod(period)}
								className={`mr-2 rounded-full px-4 py-2 ${
									selectedPeriod === period
										? "bg-emerald-500"
										: isDark
											? "bg-gray-800"
											: "bg-gray-100"
								}`}
							>
								<Text
									className={`font-medium ${
										selectedPeriod === period
											? "text-white"
											: isDark
												? "text-gray-400"
												: "text-gray-600"
									}`}
								>
									{period === "all" ? t("budget.all") : getPeriodLabel(period)}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Loading State */}
					{isLoading && (
						<View className="items-center justify-center py-12">
							<ActivityIndicator size="large" color="#10B981" />
							<Text
								className={`mt-4 text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
							>
								{t("common.loading")}
							</Text>
						</View>
					)}

					{/* Error State */}
					{error && (
						<View className="items-center justify-center py-12">
							<Feather name="alert-circle" size={48} color="#EF4444" />
							<Text
								className={`mt-4 text-center text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
							>
								{error.message || t("common.error")}
							</Text>
							<TouchableOpacity
								onPress={() => window.location.reload()}
								className="mt-4 rounded-xl bg-emerald-500 px-6 py-3"
							>
								<Text className="font-semibold text-white">Retry</Text>
							</TouchableOpacity>
						</View>
					)}

					{/* Empty State */}
					{!isLoading && !error && budgets?.length === 0 && (
						<View className="items-center justify-center py-12">
							<View
								className={`mb-4 rounded-full p-6 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
							>
								<Feather
									name="credit-card"
									size={48}
									color={isDark ? "#6B7280" : "#9CA3AF"}
								/>
							</View>
							<Text
								className={`mb-2 text-center font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}
							>
								{t("budget.noBudgets")}
							</Text>
							<Text
								className={`mb-6 text-center text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
							>
								{t("budget.noBudgetsDesc")}
							</Text>
							<TouchableOpacity
								onPress={handleAddPress}
								className="rounded-xl bg-emerald-500 px-8 py-4"
								style={{
									shadowColor: "#10B981",
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 5,
								}}
							>
								<Text className="font-bold text-lg text-white">
									{t("budget.addBudget")}
								</Text>
							</TouchableOpacity>
						</View>
					)}

					{/* Budget Cards by Period */}
					{!isLoading &&
						!error &&
						groupedBudgets &&
						Object.entries(groupedBudgets).map(([period, periodBudgets]) => (
							<View key={period} className="mb-6">
								{/* Period Header */}
								<Text
									className={`mb-3 font-semibold text-sm uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}
								>
									{getPeriodLabel(period as Period)}
								</Text>

								{/* Budget Cards */}
								{periodBudgets.map((budget) => {
									const percentage = getProgressPercentage(
										budget.spent,
										budget.limit,
									);
									const remaining = budget.limit - budget.spent;
									const progressColor = getProgressColor(percentage);
									const isMenuOpen = menuVisible === budget.id;

									return (
										<View key={budget.id} className="mb-3">
											<TouchableOpacity
												onPress={() => handleEditPress(budget)}
												activeOpacity={0.8}
												className={`rounded-2xl border p-5 ${
													isDark
														? "border-gray-800 bg-gray-900"
														: "border-gray-100 bg-white"
												}`}
												style={
													budget.strictMode
														? {
																borderLeftWidth: 4,
																borderLeftColor: "#EF4444",
															}
														: {}
												}
											>
												<View className="flex-row items-center">
													{/* Category Icon */}
													<View
														className="mr-4 rounded-full p-3"
														style={{
															backgroundColor: `${budget.category.color}20`,
														}}
													>
														<Feather
															name={budget.category.icon as any}
															size={24}
															color={budget.category.color}
														/>
													</View>

													{/* Budget Info */}
													<View className="flex-1">
														<View className="flex-row items-center justify-between">
															<Text
																className={`font-bold text-lg ${
																	isDark ? "text-white" : "text-gray-900"
																}`}
															>
																{budget.category.name}
															</Text>
															{budget.strictMode && (
																<View className="rounded-full bg-red-500/20 px-2 py-1">
																	<Text className="font-medium text-red-500 text-xs">
																		{t("budget.strict")}
																	</Text>
																</View>
															)}
														</View>

														{/* Amount */}
														<Text
															className={`mt-1 font-bold text-2xl ${
																isDark ? "text-white" : "text-gray-900"
															}`}
														>
															${budget.limit.toFixed(2)}
														</Text>

														{/* Progress Bar */}
														<View className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
															<View
																className={`h-2 rounded-full ${progressColor}`}
																style={{ width: `${percentage}%` }}
															/>
														</View>

														{/* Stats */}
														<Text
															className={`mt-1 text-sm ${
																isDark ? "text-gray-400" : "text-gray-500"
															}`}
														>
															{t("budget.spendingProgress", {
																spent: `$${budget.spent.toFixed(2)}`,
																remaining: `$${remaining.toFixed(2)}`,
															})}
														</Text>
													</View>

													{/* Three-dot Menu Button */}
													<TouchableOpacity
														onPress={() => handleMenuPress(budget.id)}
														className="ml-2 rounded-full p-2"
													>
														<Feather
															name="more-vertical"
															size={20}
															color={isDark ? "#9CA3AF" : "#6B7280"}
														/>
													</TouchableOpacity>
												</View>
											</TouchableOpacity>

											{isMenuOpen && (
												<View
													className={`absolute top-2 right-2 z-10 rounded-xl border shadow-lg ${
														isDark
															? "border-gray-700 bg-gray-800"
															: "border-gray-200 bg-white"
													}`}
													style={{
														shadowColor: "#000",
														shadowOffset: { width: 0, height: 2 },
														shadowOpacity: 0.15,
														shadowRadius: 8,
														elevation: 5,
													}}
												>
													<TouchableOpacity
														onPress={() => handleEditPress(budget)}
														className={`flex-row items-center px-4 py-3 ${
															isDark
																? "border-gray-700 border-b"
																: "border-gray-100 border-b"
														}`}
													>
														<Feather name="edit-2" size={18} color="#10B981" />
														<Text className="ml-2 font-medium text-emerald-500">
															{t("common.edit")}
														</Text>
													</TouchableOpacity>

													<TouchableOpacity
														onPress={() => handleDeletePress(budget)}
														className="flex-row items-center px-4 py-3"
													>
														<Feather name="trash-2" size={18} color="#EF4444" />
														<Text className="ml-2 font-medium text-red-500">
															{t("common.delete")}
														</Text>
													</TouchableOpacity>
												</View>
											)}
										</View>
									);
								})}
							</View>
						))}
				</View>
			</ScrollView>

			<AddBudgetModal
				visible={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingBudget(undefined);
				}}
				onSubmit={handleSubmit}
				existingBudget={editingBudget}
				isLoading={createBudget.isPending || updateBudget.isPending}
			/>

			<DeleteConfirmationModal
				visible={deleteModalVisible}
				title={t("budget.deleteBudget")}
				message={t("budget.confirmDelete")}
				isLoading={deleteBudget.isPending}
				onConfirm={handleConfirmDelete}
				onCancel={() => {
					setDeleteModalVisible(false);
					setBudgetToDelete(null);
				}}
				isDark={isDark}
			/>
		</Container>
	);
}
