import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { useI18n } from "@/lib/i18n/i18n-provider";

interface Transaction {
	id: string;
	merchant: string;
	category: string;
	amount: number;
	time: string;
	icon: string;
	iconColor: string;
	iconBgColor: string;
}

interface TransactionItemProps {
	transaction: Transaction;
	isDark: boolean;
}

export function TransactionItem({ transaction, isDark }: TransactionItemProps) {
	const { t } = useI18n();

	// Get localized category
	const getLocalizedCategory = (category: string) => {
		const categoryKey = category.toLowerCase();
		const translation = t(`categories.${categoryKey}`);
		// If translation is not found, return original
		return translation === `categories.${categoryKey}` ? category : translation;
	};

	// Localize time portion (Today, Yesterday)
	const getLocalizedTime = (time: string) => {
		if (time.startsWith("Today")) {
			return time.replace("Today", t("transactions.today"));
		}
		if (time.startsWith("Yesterday")) {
			return time.replace("Yesterday", t("transactions.yesterday"));
		}
		return time;
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
				style={{ backgroundColor: transaction.iconBgColor }}
			>
				<Feather
					name={transaction.icon as any}
					size={20}
					color={transaction.iconColor}
				/>
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
					{getLocalizedCategory(transaction.category)} •{" "}
					{getLocalizedTime(transaction.time)}
				</Text>
			</View>

			{/* Amount */}
			<Text
				className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
			>
				-${transaction.amount.toFixed(2)}
			</Text>
		</View>
	);
}
