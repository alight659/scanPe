import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { useI18n } from "@/lib/i18n/i18n-provider";

interface DeleteConfirmationModalProps {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isDark: boolean;
}

export function DeleteConfirmationModal({
	visible,
	title,
	message,
	confirmText,
	cancelText,
	isLoading = false,
	onConfirm,
	onCancel,
	isDark,
}: DeleteConfirmationModalProps) {
	const { t } = useI18n();

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View className="flex-1 items-center justify-center bg-black/50 px-6">
				<View
					className={`w-full max-w-sm rounded-2xl p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}
				>
					<View className="mb-4 items-center">
						<View className="rounded-full bg-red-500/20 p-4">
							<Feather name="alert-triangle" size={32} color="#EF4444" />
						</View>
					</View>

					<Text
						className={`mb-2 text-center font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}
					>
						{title}
					</Text>

					<Text
						className={`mb-6 text-center text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
					>
						{message}
					</Text>

					<View className="flex-row">
						<TouchableOpacity
							onPress={onCancel}
							disabled={isLoading}
							className={`mr-2 flex-1 rounded-xl py-3 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
						>
							<Text
								className={`text-center font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
							>
								{cancelText || t("common.cancel")}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={onConfirm}
							disabled={isLoading}
							className={`ml-2 flex-1 rounded-xl py-3 ${isLoading ? "bg-red-400" : "bg-red-500"}`}
						>
							<Text className="text-center font-semibold text-white">
								{isLoading
									? t("common.loading")
									: confirmText || t("common.delete")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
