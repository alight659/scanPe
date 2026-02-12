import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { CategorySelector } from "@/components/category-selector";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";
import type { Budget, Period } from "@/types/budget";
import type { Category } from "@/types/category";

interface AddBudgetModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: {
		categoryId: string;
		limit: number;
		period: Period;
		strictMode: boolean;
	}) => void;
	existingBudget?: Budget;
	isLoading?: boolean;
}

const PERIODS: Period[] = ["daily", "monthly", "yearly"];

export function AddBudgetModal({
	visible,
	onClose,
	onSubmit,
	existingBudget,
	isLoading = false,
}: AddBudgetModalProps) {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();

	const [category, setCategory] = useState<Category | null>(null);
	const [period, setPeriod] = useState<Period>("monthly");
	const [limit, setLimit] = useState("");
	const [strictMode, setStrictMode] = useState(false);
	const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

	// Reset form when modal opens/closes or budget changes
	useEffect(() => {
		if (visible) {
			if (existingBudget) {
				setCategory(existingBudget.category);
				setPeriod(existingBudget.period);
				setLimit(existingBudget.limit.toString());
				setStrictMode(existingBudget.strictMode);
			} else {
				setCategory(null);
				setPeriod("monthly");
				setLimit("");
				setStrictMode(false);
			}
		}
	}, [visible, existingBudget]);

	const handleSubmit = () => {
		const limitNum = Number.parseFloat(limit);
		if (category && limitNum > 0) {
			onSubmit({
				categoryId: category.id,
				limit: limitNum,
				period,
				strictMode,
			});
		}
	};

	const getPeriodLabel = (p: Period) => {
		switch (p) {
			case "daily":
				return t("budget.daily");
			case "monthly":
				return t("budget.monthly");
			case "yearly":
				return t("budget.yearly");
		}
	};

	const isEditing = !!existingBudget;
	const canSubmit = category && limit && Number.parseFloat(limit) > 0;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-end bg-black/50">
				<View
					className={`rounded-t-3xl p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}
				>
					{/* Header */}
					<View className="mb-6 flex-row items-center justify-between">
						<Text
							className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							{isEditing ? t("budget.editBudget") : t("budget.addBudget")}
						</Text>
						<TouchableOpacity onPress={onClose} disabled={isLoading}>
							<Feather
								name="x"
								size={24}
								color={isDark ? "#9CA3AF" : "#6B7280"}
							/>
						</TouchableOpacity>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Category Selection */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("budget.selectCategory")}
							</Text>
							<CategorySelector
								selectedCategoryId={category?.id || null}
								onSelectCategory={setCategory}
								isDark={isDark}
							/>
						</View>

						{/* Period Selection */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("budget.selectPeriod")}
							</Text>
							<TouchableOpacity
								onPress={() =>
									!isEditing && setShowPeriodDropdown(!showPeriodDropdown)
								}
								disabled={isEditing || isLoading}
								className={`flex-row items-center justify-between rounded-xl border-2 p-4 ${
									isEditing
										? isDark
											? "border-gray-700 bg-gray-800"
											: "border-gray-200 bg-gray-100"
										: isDark
											? "border-gray-700 bg-gray-800"
											: "border-gray-200 bg-white"
								}`}
							>
								<Text
									className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
								>
									{getPeriodLabel(period)}
								</Text>
								{!isEditing && (
									<Feather
										name={showPeriodDropdown ? "chevron-up" : "chevron-down"}
										size={20}
										color={isDark ? "#9CA3AF" : "#6B7280"}
									/>
								)}
							</TouchableOpacity>

							{/* Period Dropdown */}
							{showPeriodDropdown && !isEditing && (
								<View
									className={`mt-2 rounded-xl border-2 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
								>
									{PERIODS.map((p) => (
										<TouchableOpacity
											key={p}
											onPress={() => {
												setPeriod(p);
												setShowPeriodDropdown(false);
											}}
											className={`border-b p-4 ${
												isDark ? "border-gray-700" : "border-gray-100"
											} ${period === p ? "bg-emerald-500/10" : ""}`}
										>
											<View className="flex-row items-center justify-between">
												<Text
													className={`font-medium ${
														period === p
															? "text-emerald-500"
															: isDark
																? "text-white"
																: "text-gray-900"
													}`}
												>
													{getPeriodLabel(p)}
												</Text>
												{period === p && (
													<Feather name="check" size={20} color="#10B981" />
												)}
											</View>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Budget Limit Input */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("budget.budgetLimit")}
							</Text>
							<View
								className={`flex-row items-center rounded-xl border-2 ${
									isDark
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
								}`}
							>
								<Text
									className={`pl-4 font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
								>
									$
								</Text>
								<TextInput
									value={limit}
									onChangeText={setLimit}
									placeholder={t("budget.enterAmount")}
									placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
									keyboardType="decimal-pad"
									editable={!isLoading}
									className={`flex-1 px-3 py-4 font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
								/>
							</View>
						</View>

						{/* Strict Mode Toggle */}
						<View
							className={`mb-6 rounded-xl border-2 p-4 ${
								isDark
									? "border-gray-700 bg-gray-800"
									: "border-gray-200 bg-white"
							}`}
						>
							<View className="flex-row items-center justify-between">
								<View className="flex-1">
									<Text
										className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
									>
										{t("budget.strictMode")}
									</Text>
									<Text
										className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
									>
										{t("budget.strictModeDesc")}
									</Text>
								</View>
								<Switch
									value={strictMode}
									onValueChange={setStrictMode}
									disabled={isLoading}
									trackColor={{ false: "#D1D5DB", true: "#10B981" }}
									thumbColor={strictMode ? "#10B981" : "#F3F4F6"}
								/>
							</View>
						</View>

						{/* Submit Button */}
						<TouchableOpacity
							onPress={handleSubmit}
							disabled={isLoading || !canSubmit}
							className={`rounded-xl py-4 ${
								isLoading || !canSubmit ? "bg-gray-400" : "bg-emerald-500"
							}`}
							style={
								!isLoading && canSubmit
									? {
											shadowColor: "#10B981",
											shadowOffset: { width: 0, height: 4 },
											shadowOpacity: 0.3,
											shadowRadius: 8,
											elevation: 5,
										}
									: {}
							}
						>
							<Text className="text-center font-bold text-lg text-white">
								{isLoading
									? t("common.loading")
									: isEditing
										? t("budget.updateBudget")
										: t("budget.createBudget")}
							</Text>
						</TouchableOpacity>

						<View className="h-6" />
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
