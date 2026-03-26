import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { useI18n } from "@/lib/i18n/i18n-provider";
import type { Transaction } from "@/types/transaction";

interface TransactionItemProps {
	transaction: Transaction;
	isDark: boolean;
	onEdit?: (transaction: Transaction) => void;
	onDelete?: (id: string) => void;
}

function getRelativeTime(dateStr: string, t: (key: string) => string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const transactionDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	const timeStr = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	if (transactionDate.getTime() === today.getTime()) {
		return `${t("transactions.today")}, ${timeStr}`;
	}
	if (transactionDate.getTime() === yesterday.getTime()) {
		return `${t("transactions.yesterday")}, ${timeStr}`;
	}
	return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${timeStr}`;
}

export function getDateKey(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toISOString().split("T")[0];
}

export function formatDateHeader(
	dateStr: string,
	t: (key: string) => string,
): string {
	const date = new Date(dateStr);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const transactionDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	if (transactionDate.getTime() === today.getTime()) {
		return t("transactions.today");
	}
	if (transactionDate.getTime() === yesterday.getTime()) {
		return t("transactions.yesterday");
	}
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function TransactionItem({
	transaction,
	isDark,
	onEdit,
	onDelete,
}: TransactionItemProps) {
	const { t } = useI18n();

	const categoryName = transaction.budget?.category?.name || "Expense";
	const categoryIcon = transaction.budget?.category?.icon || "dollar-sign";
	const categoryColor = transaction.budget?.category?.color || "#6B7280";
	const iconBgColor = `${categoryColor}20`;

	const getLocalizedCategory = (category: string) => {
		const categoryKey = category.toLowerCase();
		const translation = t(`categories.${categoryKey}`);
		return translation === `categories.${categoryKey}` ? category : translation;
	};

	return (
		<View
			className={`mb-3 flex-row items-center rounded-xl border p-4 ${
				isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
			}`}
		>
			{/* Icon Container */}
			<View
				className="mr-4 h-12 w-12 items-center justify-center rounded-full"
				style={{ backgroundColor: iconBgColor }}
			>
				<Feather name={categoryIcon as any} size={20} color={categoryColor} />
			</View>

			{/* Details */}
			<View className="flex-1">
				<Text
					className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
				>
					{transaction.merchant}
				</Text>
				<Text
					className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
				>
					{getLocalizedCategory(categoryName)} •{" "}
					{getRelativeTime(transaction.createdAt, t)}
				</Text>
			</View>

			{/* Amount & Actions */}
			<View className="flex-row items-center">
				<Text
					className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
				>
					-${transaction.amount.toFixed(2)}
				</Text>
				{onEdit && (
					<TouchableOpacity
						onPress={() => onEdit(transaction)}
						className="ml-2 rounded-full p-1"
					>
						<Feather name="edit-2" size={16} color="#10B981" />
					</TouchableOpacity>
				)}
				{onDelete && (
					<TouchableOpacity
						onPress={() => onDelete(transaction.id)}
						className="ml-2 rounded-full p-1"
					>
						<Feather name="trash-2" size={16} color="#EF4444" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
