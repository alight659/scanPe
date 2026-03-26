import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { useBudgets } from "@/lib/api/budgets";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";
import type { Budget } from "@/types/budget";

interface AddTransactionModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: {
		budgetId: string;
		amount: number;
		merchant: string;
		description?: string;
	}) => void;
	isLoading?: boolean;
}

export function AddTransactionModal({
	visible,
	onClose,
	onSubmit,
	isLoading = false,
}: AddTransactionModalProps) {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();

	const { data: budgets } = useBudgets();

	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const [merchant, setMerchant] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

	useEffect(() => {
		if (visible) {
			setSelectedBudget(null);
			setMerchant("");
			setAmount("");
			setDescription("");
			setShowBudgetDropdown(false);
		}
	}, [visible]);

	const handleSubmit = () => {
		const amountNum = Number.parseFloat(amount);
		if (selectedBudget && merchant.trim() && amountNum > 0) {
			onSubmit({
				budgetId: selectedBudget.id,
				amount: amountNum,
				merchant: merchant.trim(),
				description: description.trim() || undefined,
			});
		}
	};

	const canSubmit =
		selectedBudget && merchant.trim() && Number.parseFloat(amount) > 0;

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
							{t("transactions.addTransaction")}
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
						{/* Budget Selection */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("transactions.selectBudget")}
							</Text>

							{!budgets || budgets.length === 0 ? (
								<View
									className={`rounded-xl border-2 p-4 ${
										isDark
											? "border-gray-700 bg-gray-800"
											: "border-gray-200 bg-gray-50"
									}`}
								>
									<Text
										className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
									>
										{t("transactions.noBudgetsAvailable")}
									</Text>
								</View>
							) : (
								<>
									<TouchableOpacity
										onPress={() =>
											!isLoading && setShowBudgetDropdown(!showBudgetDropdown)
										}
										disabled={isLoading}
										className={`flex-row items-center justify-between rounded-xl border-2 p-4 ${
											isDark
												? "border-gray-700 bg-gray-800"
												: "border-gray-200 bg-white"
										}`}
									>
										{selectedBudget ? (
											<View className="flex-1 flex-row items-center">
												<View
													className="mr-3 h-8 w-8 items-center justify-center rounded-full"
													style={{
														backgroundColor: `${selectedBudget.category.color}20`,
													}}
												>
													<Feather
														name={selectedBudget.category.icon as any}
														size={16}
														color={selectedBudget.category.color}
													/>
												</View>
												<View className="flex-1">
													<Text
														className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
													>
														{selectedBudget.category.name}
													</Text>
													<Text
														className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
													>
														${selectedBudget.spent.toFixed(2)} / $
														{selectedBudget.limit.toFixed(2)}
													</Text>
												</View>
											</View>
										) : (
											<Text
												className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
											>
												{t("transactions.selectBudget")}
											</Text>
										)}
										<Feather
											name={showBudgetDropdown ? "chevron-up" : "chevron-down"}
											size={20}
											color={isDark ? "#9CA3AF" : "#6B7280"}
										/>
									</TouchableOpacity>

									{/* Budget Dropdown */}
									{showBudgetDropdown && (
										<View
											className={`mt-2 max-h-48 rounded-xl border-2 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
										>
											<ScrollView
												nestedScrollEnabled
												showsVerticalScrollIndicator={false}
											>
												{budgets.map((budget) => {
													const remaining = budget.limit - budget.spent;
													return (
														<TouchableOpacity
															key={budget.id}
															onPress={() => {
																setSelectedBudget(budget);
																setShowBudgetDropdown(false);
															}}
															className={`flex-row items-center border-b p-4 ${
																isDark ? "border-gray-700" : "border-gray-100"
															} ${selectedBudget?.id === budget.id ? "bg-emerald-500/10" : ""}`}
														>
															<View
																className="mr-3 h-8 w-8 items-center justify-center rounded-full"
																style={{
																	backgroundColor: `${budget.category.color}20`,
																}}
															>
																<Feather
																	name={budget.category.icon as any}
																	size={16}
																	color={budget.category.color}
																/>
															</View>
															<View className="flex-1">
																<Text
																	className={`font-medium ${
																		selectedBudget?.id === budget.id
																			? "text-emerald-500"
																			: isDark
																				? "text-white"
																				: "text-gray-900"
																	}`}
																>
																	{budget.category.name}
																</Text>
																<Text
																	className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
																>
																	${remaining.toFixed(2)} remaining
																</Text>
															</View>
															{selectedBudget?.id === budget.id && (
																<Feather
																	name="check"
																	size={20}
																	color="#10B981"
																/>
															)}
														</TouchableOpacity>
													);
												})}
											</ScrollView>
										</View>
									)}
								</>
							)}
						</View>

						{/* Merchant Input */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("transactions.merchant")}
							</Text>
							<View
								className={`rounded-xl border-2 ${
									isDark
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
								}`}
							>
								<TextInput
									value={merchant}
									onChangeText={setMerchant}
									placeholder={t("transactions.merchantPlaceholder")}
									placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
									editable={!isLoading}
									className={`px-4 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
								/>
							</View>
						</View>

						{/* Amount Input */}
						<View className="mb-4">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("transactions.amount")}
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
									value={amount}
									onChangeText={setAmount}
									placeholder="0.00"
									placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
									keyboardType="decimal-pad"
									editable={!isLoading}
									className={`flex-1 px-3 py-4 font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
								/>
							</View>
						</View>

						{/* Description Input */}
						<View className="mb-6">
							<Text
								className={`mb-2 font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
							>
								{t("transactions.description")}
							</Text>
							<View
								className={`rounded-xl border-2 ${
									isDark
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
								}`}
							>
								<TextInput
									value={description}
									onChangeText={setDescription}
									placeholder={t("transactions.descriptionPlaceholder")}
									placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
									editable={!isLoading}
									className={`px-4 py-4 text-base ${isDark ? "text-white" : "text-gray-900"}`}
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
									: t("transactions.createTransaction")}
							</Text>
						</TouchableOpacity>

						<View className="h-6" />
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
