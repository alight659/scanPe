import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SpendingAlertProps {
	percentage: number;
	isDark: boolean;
}

export function SpendingAlert({ percentage, isDark }: SpendingAlertProps) {
	if (percentage < 60) return null;

	return (
		<View
			className={`mx-4 mb-6 rounded-xl p-4 ${isDark ? "bg-orange-900/30" : "bg-orange-50"}`}
		>
			<View className="flex-row items-start">
				<View
					className={`mr-3 rounded-full p-2 ${isDark ? "bg-orange-800" : "bg-orange-100"}`}
				>
					<Feather
						name="trending-up"
						size={20}
						color={isDark ? "#F97316" : "#EA580C"}
					/>
				</View>
				<View className="flex-1">
					<Text
						className={`mb-1 font-semibold ${isDark ? "text-orange-400" : "text-orange-600"}`}
					>
						Spending Alert
					</Text>
					<Text
						className={`text-sm leading-5 ${isDark ? "text-orange-300" : "text-orange-700"}`}
					>
						You've used {percentage}% of your daily budget. Slow down to make it
						through the day!
					</Text>
				</View>
			</View>
		</View>
	);
}
