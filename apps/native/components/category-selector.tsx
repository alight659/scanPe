import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import {
	useCategories,
	useCreateCategory,
	useDeleteCategory,
} from "@/lib/api/categories";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";
import type { Category } from "@/types/category";

interface CategorySelectorProps {
	selectedCategoryId: string | null;
	onSelectCategory: (category: Category) => void;
	isDark: boolean;
}

const CATEGORY_COLORS = [
	"#10B981", // emerald
	"#F59E0B", // amber
	"#8B5CF6", // violet
	"#EC4899", // pink
	"#3B82F6", // blue
	"#F97316", // orange
	"#EF4444", // red
	"#06B6D4", // cyan
	"#84CC16", // lime
	"#6B7280", // gray
];

export function CategorySelector({
	selectedCategoryId,
	onSelectCategory,
	isDark,
}: CategorySelectorProps) {
	const { t } = useI18n();
	const [showDropdown, setShowDropdown] = useState(false);
	const [showManager, setShowManager] = useState(false);

	const { data: categories, isLoading } = useCategories();
	const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

	if (isLoading) {
		return (
			<View
				className={`rounded-xl border-2 p-4 ${
					isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
				}`}
			>
				<Text className={isDark ? "text-gray-400" : "text-gray-500"}>
					{t("common.loading")}
				</Text>
			</View>
		);
	}

	return (
		<>
			<TouchableOpacity
				onPress={() => setShowDropdown(!showDropdown)}
				className={`flex-row items-center justify-between rounded-xl border-2 p-4 ${
					isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
				}`}
			>
				<View className="flex-row items-center">
					{selectedCategory ? (
						<>
							<View
								className="mr-3 rounded-full p-2"
								style={{ backgroundColor: `${selectedCategory.color}20` }}
							>
								<Feather
									name={selectedCategory.icon as any}
									size={20}
									color={selectedCategory.color}
								/>
							</View>
							<Text
								className={`font-medium ${
									isDark ? "text-white" : "text-gray-900"
								}`}
							>
								{selectedCategory.name}
							</Text>
						</>
					) : (
						<Text
							className={`font-medium ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{t("budget.selectCategory")}
						</Text>
					)}
				</View>
				<Feather
					name={showDropdown ? "chevron-up" : "chevron-down"}
					size={20}
					color={isDark ? "#9CA3AF" : "#6B7280"}
				/>
			</TouchableOpacity>

			{/* Category Dropdown */}
			{showDropdown && categories && (
				<View
					className={`mt-2 rounded-xl border-2 ${
						isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
					}`}
				>
					<ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
						{categories.map((category) => (
							<TouchableOpacity
								key={category.id}
								onPress={() => {
									onSelectCategory(category);
									setShowDropdown(false);
								}}
								className={`flex-row items-center border-b p-4 ${
									isDark ? "border-gray-700" : "border-gray-100"
								} ${selectedCategoryId === category.id ? "bg-emerald-500/10" : ""}`}
							>
								<View
									className="mr-3 rounded-full p-2"
									style={{ backgroundColor: `${category.color}20` }}
								>
									<Feather
										name={category.icon as any}
										size={20}
										color={category.color}
									/>
								</View>
								<Text
									className={`flex-1 font-medium ${
										selectedCategoryId === category.id
											? "text-emerald-500"
											: isDark
												? "text-white"
												: "text-gray-900"
									}`}
								>
									{category.name}
								</Text>
								{selectedCategoryId === category.id && (
									<Feather name="check" size={20} color="#10B981" />
								)}
							</TouchableOpacity>
						))}
					</ScrollView>

					{/* Manage Categories Button */}
					<TouchableOpacity
						onPress={() => {
							setShowDropdown(false);
							setShowManager(true);
						}}
						className={`flex-row items-center justify-center border-t p-4 ${
							isDark ? "border-gray-700" : "border-gray-100"
						}`}
					>
						<Feather name="settings" size={18} color="#10B981" />
						<Text className="ml-2 font-medium text-emerald-500">
							{t("budget.manageCategories")}
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Category Manager Modal */}
			<CategoryManagerModal
				visible={showManager}
				onClose={() => setShowManager(false)}
				isDark={isDark}
			/>
		</>
	);
}

interface CategoryManagerModalProps {
	visible: boolean;
	onClose: () => void;
	isDark: boolean;
}

function CategoryManagerModal({
	visible,
	onClose,
	isDark,
}: CategoryManagerModalProps) {
	const { t } = useI18n();
	const { data: categories } = useCategories();
	const createCategory = useCreateCategory();
	const deleteCategory = useDeleteCategory();

	const [showAddForm, setShowAddForm] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);

	const userCategories = categories?.filter((c) => !c.isDefault) || [];

	const handleCreateCategory = () => {
		if (newCategoryName.trim()) {
			createCategory.mutate(
				{
					name: newCategoryName.trim(),
					color: selectedColor,
				},
				{
					onSuccess: () => {
						setNewCategoryName("");
						setShowAddForm(false);
					},
				},
			);
		}
	};

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
							{t("budget.manageCategories")}
						</Text>
						<TouchableOpacity onPress={onClose}>
							<Feather
								name="x"
								size={24}
								color={isDark ? "#9CA3AF" : "#6B7280"}
							/>
						</TouchableOpacity>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						{/* User Categories List */}
						{userCategories.length > 0 && (
							<View className="mb-4">
								<Text
									className={`mb-3 font-medium text-sm ${
										isDark ? "text-gray-400" : "text-gray-600"
									}`}
								>
									{t("budget.yourCategories")}
								</Text>
								{userCategories.map((category) => (
									<View
										key={category.id}
										className={`mb-2 flex-row items-center justify-between rounded-xl border p-4 ${
											isDark
												? "border-gray-700 bg-gray-800"
												: "border-gray-200 bg-white"
										}`}
									>
										<View className="flex-row items-center">
											<View
												className="mr-3 rounded-full p-2"
												style={{ backgroundColor: `${category.color}20` }}
											>
												<Feather
													name={category.icon as any}
													size={20}
													color={category.color}
												/>
											</View>
											<Text
												className={`font-medium ${
													isDark ? "text-white" : "text-gray-900"
												}`}
											>
												{category.name}
											</Text>
										</View>
										<TouchableOpacity
											onPress={() => deleteCategory.mutate(category.id)}
											disabled={deleteCategory.isPending}
										>
											<Feather name="trash-2" size={20} color="#EF4444" />
										</TouchableOpacity>
									</View>
								))}
							</View>
						)}

						{/* Add Category Form */}
						{showAddForm ? (
							<View
								className={`rounded-xl border-2 p-4 ${
									isDark
										? "border-gray-700 bg-gray-800"
										: "border-gray-200 bg-white"
								}`}
							>
								<TextInput
									value={newCategoryName}
									onChangeText={setNewCategoryName}
									placeholder={t("budget.categoryNamePlaceholder")}
									placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
									className={`mb-4 rounded-lg border p-3 ${
										isDark
											? "border-gray-600 bg-gray-700 text-white"
											: "border-gray-300 bg-white text-gray-900"
									}`}
								/>

								{/* Color Selection */}
								<Text
									className={`mb-2 text-sm ${
										isDark ? "text-gray-400" : "text-gray-600"
									}`}
								>
									{t("budget.selectColor")}
								</Text>
								<View className="mb-4 flex-row flex-wrap">
									{CATEGORY_COLORS.map((color) => (
										<TouchableOpacity
											key={color}
											onPress={() => setSelectedColor(color)}
											className={`mr-2 mb-2 h-10 w-10 rounded-full ${
												selectedColor === color ? "border-2 border-white" : ""
											}`}
											style={{
												backgroundColor: color,
												shadowColor: color,
												shadowOffset: { width: 0, height: 2 },
												shadowOpacity: selectedColor === color ? 0.5 : 0,
												shadowRadius: 4,
												elevation: selectedColor === color ? 3 : 0,
											}}
										/>
									))}
								</View>

								{/* Action Buttons */}
								<View className="flex-row">
									<TouchableOpacity
										onPress={() => setShowAddForm(false)}
										className={`mr-2 flex-1 rounded-lg py-3 ${
											isDark ? "bg-gray-700" : "bg-gray-200"
										}`}
									>
										<Text
											className={`text-center font-medium ${
												isDark ? "text-white" : "text-gray-700"
											}`}
										>
											{t("common.cancel")}
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={handleCreateCategory}
										disabled={
											!newCategoryName.trim() || createCategory.isPending
										}
										className={`flex-1 rounded-lg py-3 ${
											!newCategoryName.trim() || createCategory.isPending
												? "bg-gray-400"
												: "bg-emerald-500"
										}`}
									>
										<Text className="text-center font-medium text-white">
											{createCategory.isPending
												? t("common.loading")
												: t("budget.addCategory")}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<TouchableOpacity
								onPress={() => setShowAddForm(true)}
								className={`flex-row items-center justify-center rounded-xl border-2 border-dashed py-4 ${
									isDark
										? "border-gray-700 bg-gray-900/50"
										: "border-gray-300 bg-gray-50"
								}`}
							>
								<Feather
									name="plus-circle"
									size={24}
									color={isDark ? "#6B7280" : "#9CA3AF"}
								/>
								<Text
									className={`ml-2 font-medium ${
										isDark ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{t("budget.addCategory")}
								</Text>
							</TouchableOpacity>
						)}
					</ScrollView>

					<View className="h-6" />
				</View>
			</View>
		</Modal>
	);
}
