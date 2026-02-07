import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface BudgetChartProps {
	spent: number;
	total: number;
	period: "daily" | "monthly";
	onPeriodChange: (period: "daily" | "monthly") => void;
	isDark: boolean;
}

export function BudgetChart({
	spent,
	total,
	period,
	onPeriodChange,
	isDark,
}: BudgetChartProps) {
	const remaining = total - spent;
	const percentage = Math.min((spent / total) * 100, 100);
	const size = 200;
	const strokeWidth = 20;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<View className="items-center">
			{/* Circular Progress */}
			<View className="relative mb-6">
				<Svg width={size} height={size}>
					{/* Background Circle */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={isDark ? "#374151" : "#E5E7EB"}
						strokeWidth={strokeWidth}
						fill="none"
					/>
					{/* Progress Circle */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#10B981"
						strokeWidth={strokeWidth}
						fill="none"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
				</Svg>

				{/* Center Content */}
				<View className="absolute inset-0 items-center justify-center">
					<Text
						className={`text-xs uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
					>
						{period === "daily" ? "DAILY LEFT" : "MONTHLY LEFT"}
					</Text>
					<Text className="font-bold text-4xl text-gray-900 dark:text-gray-200">
						${remaining}
					</Text>
					<Text
						className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
					>
						${spent} spent
					</Text>
				</View>
			</View>

			{/* Period Toggle */}
			<View
				className={`flex-row rounded-full p-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
			>
				<TouchableOpacity
					onPress={() => onPeriodChange("daily")}
					className={`rounded-full px-6 py-2 ${
						period === "daily" ? "bg-white shadow-sm" : "bg-transparent"
					}`}
				>
					<Text
						className={`font-medium ${
							period === "daily"
								? "text-gray-900"
								: isDark
									? "text-gray-400"
									: "text-gray-500"
						}`}
					>
						Daily
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => onPeriodChange("monthly")}
					className={`rounded-full px-6 py-2 ${
						period === "monthly" ? "bg-white shadow-sm" : "bg-transparent"
					}`}
				>
					<Text
						className={`font-medium ${
							period === "monthly"
								? "text-gray-900"
								: isDark
									? "text-gray-400"
									: "text-gray-500"
						}`}
					>
						Monthly
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
