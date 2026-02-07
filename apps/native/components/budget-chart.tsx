import React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useI18n } from "@/lib/i18n/i18n-provider";

interface BudgetChartProps {
	spent: number;
	total: number;
	period: "daily" | "monthly" | "yearly";
	onPeriodChange: (period: "daily" | "monthly" | "yearly") => void;
	isDark: boolean;
}

export function BudgetChart({
	spent,
	total,
	period,
	onPeriodChange,
	isDark,
}: BudgetChartProps) {
	const { t } = useI18n();
	const remaining = total - spent;
	const percentage = Math.min((spent / total) * 100, 100);
	const size = 200;
	const strokeWidth = 20;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	const getPeriodLabel = () => {
		switch (period) {
			case "daily":
				return t("home.dailyLeft");
			case "monthly":
				return t("home.monthlyLeft");
			case "yearly":
				return t("home.yearlyLeft");
		}
	};

	const handleDailyPress = () => {
		console.log("Daily pressed");
		onPeriodChange("daily");
	};

	const handleMonthlyPress = () => {
		console.log("Monthly pressed");
		onPeriodChange("monthly");
	};

	const handleYearlyPress = () => {
		console.log("Yearly pressed");
		onPeriodChange("yearly");
	};

	return (
		<View style={{ alignItems: "center" }}>
			{/* Circular Progress */}
			<View style={{ position: "relative", marginBottom: 24 }}>
				<Svg width={size} height={size}>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={isDark ? "#374151" : "#E5E7EB"}
						strokeWidth={strokeWidth}
						fill="none"
					/>
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

				<View
					style={{
						position: "absolute",
						inset: 0,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: 12,
							textTransform: "uppercase",
							letterSpacing: 1,
							color: isDark ? "#9CA3AF" : "#6B7280",
						}}
					>
						{getPeriodLabel()}
					</Text>
					<Text
						style={{
							fontSize: 32,
							fontWeight: "bold",
							color: isDark ? "#F3F4F6" : "#111827",
						}}
					>
						${remaining.toLocaleString()}
					</Text>
					<Text
						style={{
							fontSize: 14,
							color: isDark ? "#9CA3AF" : "#6B7280",
						}}
					>
						${spent.toLocaleString()} {t("home.spent")}
					</Text>
				</View>
			</View>

			{/* Period Toggle */}
			<View
				style={{
					flexDirection: "row",
					borderRadius: 999,
					padding: 4,
					backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
				}}
			>
				<Pressable
					onPress={handleDailyPress}
					style={{
						borderRadius: 999,
						paddingHorizontal: 20,
						paddingVertical: 8,
						backgroundColor: period === "daily" ? "#FFFFFF" : "transparent",
						shadowColor: period === "daily" ? "#000" : "transparent",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 2,
						elevation: period === "daily" ? 2 : 0,
					}}
				>
					<Text
						style={{
							fontWeight: "500",
							color:
								period === "daily" ? "#111827" : isDark ? "#9CA3AF" : "#6B7280",
						}}
					>
						{t("home.daily")}
					</Text>
				</Pressable>

				<Pressable
					onPress={handleMonthlyPress}
					style={{
						borderRadius: 999,
						paddingHorizontal: 20,
						paddingVertical: 8,
						backgroundColor: period === "monthly" ? "#FFFFFF" : "transparent",
						shadowColor: period === "monthly" ? "#000" : "transparent",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 2,
						elevation: period === "monthly" ? 2 : 0,
					}}
				>
					<Text
						style={{
							fontWeight: "500",
							color:
								period === "monthly"
									? "#111827"
									: isDark
										? "#9CA3AF"
										: "#6B7280",
						}}
					>
						{t("home.monthly")}
					</Text>
				</Pressable>

				<Pressable
					onPress={handleYearlyPress}
					style={{
						borderRadius: 999,
						paddingHorizontal: 20,
						paddingVertical: 8,
						backgroundColor: period === "yearly" ? "#FFFFFF" : "transparent",
						shadowColor: period === "yearly" ? "#000" : "transparent",
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.1,
						shadowRadius: 2,
						elevation: period === "yearly" ? 2 : 0,
					}}
				>
					<Text
						style={{
							fontWeight: "500",
							color:
								period === "yearly"
									? "#111827"
									: isDark
										? "#9CA3AF"
										: "#6B7280",
						}}
					>
						{t("home.yearly")}
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
