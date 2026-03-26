import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { AddTransactionModal } from "@/components/add-transaction-modal";
import { Container } from "@/components/container";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
	formatDateHeader,
	getDateKey,
	TransactionItem,
} from "@/components/transaction-item";
import {
	useCreateTransaction,
	useDeleteTransaction,
	useTransactions,
} from "@/lib/api/transactions";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useColorScheme } from "@/lib/theme-provider";

export default function TransactionsScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === "dark";
	const { t } = useI18n();
	const [searchQuery, setSearchQuery] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
		null,
	);

	const { data: transactions, isLoading, error } = useTransactions();
	const createTransaction = useCreateTransaction();
	const deleteTransaction = useDeleteTransaction();

	// Calculate totals
	const totalSpent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

	// Filter transactions based on search
	const filteredTransactions =
		transactions?.filter((transaction) => {
			const matchesSearch =
				searchQuery === "" ||
				transaction.merchant
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				(transaction.budget?.category?.name || "")
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
			return matchesSearch;
		}) || [];

	// Group transactions by date
	const groupedTransactions = filteredTransactions.reduce(
		(groups, transaction) => {
			const date = getDateKey(transaction.createdAt);
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(transaction);
			return groups;
		},
		{} as Record<string, typeof filteredTransactions>,
	);

	// Sort dates in descending order
	const sortedDates = Object.keys(groupedTransactions).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	);

	const handleCreateTransaction = (data: {
		budgetId: string;
		amount: number;
		merchant: string;
		description?: string;
	}) => {
		createTransaction.mutate(data, {
			onSuccess: () => {
				setShowAddModal(false);
			},
			onError: (err) => {
				Alert.alert(t("common.error"), err.message);
			},
		});
	};

	const handleDeletePress = (id: string) => {
		setTransactionToDelete(id);
		setDeleteModalVisible(true);
	};

	const handleConfirmDelete = () => {
		if (transactionToDelete) {
			deleteTransaction.mutate(transactionToDelete, {
				onSuccess: () => {
					setDeleteModalVisible(false);
					setTransactionToDelete(null);
				},
				onError: (err) => {
					Alert.alert(t("common.error"), err.message);
					setDeleteModalVisible(false);
					setTransactionToDelete(null);
				},
			});
		}
	};

	return (
		<Container>
			<View
				className={`flex-row items-center justify-between border-b px-4 py-4 ${
					isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
				}`}
			>
				<TouchableOpacity
					onPress={() => router.back()}
					className={`rounded-full p-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
				>
					<Feather
						name="arrow-left"
						size={20}
						color={isDark ? "#fff" : "#111827"}
					/>
				</TouchableOpacity>

				<Text
					className={`font-bold text-lg ${
						isDark ? "text-white" : "text-gray-900"
					}`}
				>
					{t("transactions.allTransactions")}
				</Text>

				<View className="w-10" />
			</View>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Summary Card */}
				<View className="px-6 py-4">
					<View
						className={`rounded-2xl border p-6 ${
							isDark
								? "border-gray-800 bg-gray-900"
								: "border-gray-100 bg-white"
						}`}
					>
						<Text
							className={`mb-1 text-sm ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{t("transactions.totalSpent")}
						</Text>
						<Text
							className={`font-bold text-3xl ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						>
							${totalSpent.toFixed(2)}
						</Text>
						<Text
							className={`mt-1 text-sm ${
								isDark ? "text-gray-400" : "text-gray-500"
							}`}
						>
							{transactions?.length || 0} {t("home.transactions")}
						</Text>
					</View>
				</View>

				{/* Search Bar */}
				<View className="px-6 pb-4">
					<View
						className={`flex-row items-center rounded-xl border-2 px-4 py-3 ${
							isDark
								? "border-gray-700 bg-gray-800"
								: "border-gray-200 bg-gray-50"
						}`}
					>
						<Feather
							name="search"
							size={20}
							color={isDark ? "#6B7280" : "#9CA3AF"}
						/>
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder={t("transactions.searchPlaceholder")}
							placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
							className={`ml-3 flex-1 text-base ${
								isDark ? "text-white" : "text-gray-900"
							}`}
						/>
						{searchQuery !== "" && (
							<TouchableOpacity onPress={() => setSearchQuery("")}>
								<Feather
									name="x"
									size={20}
									color={isDark ? "#6B7280" : "#9CA3AF"}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Loading State */}
				{isLoading && (
					<View className="items-center justify-center py-12">
						<ActivityIndicator size="large" color="#10B981" />
						<Text
							className={`mt-4 text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
						>
							{t("common.loading")}
						</Text>
					</View>
				)}

				{/* Error State */}
				{error && (
					<View className="items-center justify-center px-6 py-12">
						<Feather name="alert-circle" size={48} color="#EF4444" />
						<Text
							className={`mt-4 text-center text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
						>
							{error.message || t("common.error")}
						</Text>
					</View>
				)}

				{/* Transactions List */}
				{!isLoading && !error && (
					<View className="px-6">
						{sortedDates.map((date) => (
							<View key={date} className="mb-6">
								<Text
									className={`mb-3 font-semibold text-sm ${
										isDark ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{formatDateHeader(groupedTransactions[date][0].createdAt, t)}
								</Text>
								{groupedTransactions[date].map((transaction) => (
									<TransactionItem
										key={transaction.id}
										transaction={transaction}
										isDark={isDark}
										onDelete={handleDeletePress}
									/>
								))}
							</View>
						))}

						{filteredTransactions.length === 0 && (
							<View className="items-center justify-center py-12">
								<Feather
									name="inbox"
									size={48}
									color={isDark ? "#374151" : "#D1D5DB"}
								/>
								<Text
									className={`mt-4 text-center ${
										isDark ? "text-gray-400" : "text-gray-500"
									}`}
								>
									{t("transactions.noTransactions")}
								</Text>
							</View>
						)}
					</View>
				)}
			</ScrollView>

			{/* FAB - Add Transaction */}
			<TouchableOpacity
				onPress={() => setShowAddModal(true)}
				className="absolute right-6 bottom-6 h-14 w-14 items-center justify-center rounded-full bg-emerald-500"
				style={{
					shadowColor: "#10B981",
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.3,
					shadowRadius: 8,
					elevation: 8,
				}}
			>
				<Feather name="plus" size={28} color="#FFFFFF" />
			</TouchableOpacity>

			{/* Add Transaction Modal */}
			<AddTransactionModal
				visible={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={handleCreateTransaction}
				isLoading={createTransaction.isPending}
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				visible={deleteModalVisible}
				title={t("transactions.deleteTransaction")}
				message={t("transactions.confirmDelete")}
				isLoading={deleteTransaction.isPending}
				onConfirm={handleConfirmDelete}
				onCancel={() => {
					setDeleteModalVisible(false);
					setTransactionToDelete(null);
				}}
				isDark={isDark}
			/>
		</Container>
	);
}
