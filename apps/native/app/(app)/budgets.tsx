import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Container } from "@/components/container";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";

export default function BudgetsScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();

	return (
		<Container>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="p-6">
					<Text
						className={`mb-6 font-bold text-3xl ${isDark ? "text-white" : "text-gray-900"}`}
					>
						{t("budget.budgets")}
					</Text>

					{/* Daily Budget Card */}
					<View
						className={`mb-4 rounded-2xl border p-6 ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
					>
						<Text
							className={`mb-2 font-medium text-sm uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							{t("budget.dailyBudget")}
						</Text>
						<Text
							className={`font-bold text-3xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							$100.00
						</Text>
						<View className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
							<View className="h-2 w-[68%] rounded-full bg-emerald-500" />
						</View>
						<Text
							className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							$68 spent • $32 {t("budget.remaining")}
						</Text>
					</View>

					{/* Monthly Budget Card */}
					<View
						className={`mb-4 rounded-2xl border p-6 ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
					>
						<Text
							className={`mb-2 font-medium text-sm uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							{t("budget.monthlyBudget")}
						</Text>
						<Text
							className={`font-bold text-3xl ${isDark ? "text-white" : "text-gray-900"}`}
						>
							$2,000.00
						</Text>
						<View className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
							<View className="h-2 w-[60%] rounded-full bg-emerald-500" />
						</View>
						<Text
							className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							$1,200 spent • $800 {t("budget.remaining")}
						</Text>
					</View>

					{/* Strict Mode Toggle */}
					<View
						className={`mt-6 rounded-2xl border p-6 ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
					>
						<View className="flex-row items-center justify-between">
							<View>
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
							<View className="h-6 w-11 rounded-full bg-emerald-500">
								<View className="mt-1 ml-5 h-4 w-4 rounded-full bg-white" />
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
