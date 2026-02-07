import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

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
					{transaction.category} • {transaction.time}
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
