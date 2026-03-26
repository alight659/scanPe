import { env } from "@scanPe/env/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateTransactionInput,
	Transaction,
	UpdateTransactionInput,
} from "../../types/transaction";
import { authClient } from "../auth-client";

const API_URL = env.EXPO_PUBLIC_SERVER_URL;

async function getAuthToken(): Promise<string | null> {
	const session = await authClient.getSession();
	if (session?.data?.session?.token) {
		return session.data.session.token;
	}
	return null;
}

async function fetchTransactions(): Promise<Transaction[]> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/transactions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized. Please sign in again.");
		}
		const error = await response
			.json()
			.catch(() => ({ error: "Unknown error" }));
		throw new Error(error.error || "Failed to fetch transactions");
	}

	return response.json();
}

async function createTransaction(
	input: CreateTransactionInput,
): Promise<Transaction> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/transactions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized. Please sign in again.");
		}
		const error = await response
			.json()
			.catch(() => ({ error: "Unknown error" }));
		throw new Error(error.error || "Failed to create transaction");
	}

	return response.json();
}

async function updateTransaction(
	id: string,
	input: UpdateTransactionInput,
): Promise<Transaction> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/transactions/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized. Please sign in again.");
		}
		const error = await response
			.json()
			.catch(() => ({ error: "Unknown error" }));
		throw new Error(error.error || "Failed to update transaction");
	}

	return response.json();
}

async function deleteTransaction(id: string): Promise<void> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/transactions/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized. Please sign in again.");
		}
		const error = await response
			.json()
			.catch(() => ({ error: "Unknown error" }));
		throw new Error(error.error || "Failed to delete transaction");
	}
}

export function useTransactions() {
	return useQuery({
		queryKey: ["transactions"],
		queryFn: fetchTransactions,
		enabled: true,
		retry: (failureCount, error) => {
			if (error instanceof Error && error.message.includes("Unauthorized")) {
				return false;
			}
			return failureCount < 3;
		},
	});
}

export function useCreateTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}

export function useUpdateTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateTransactionInput;
		}) => updateTransaction(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}

export function useDeleteTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}
