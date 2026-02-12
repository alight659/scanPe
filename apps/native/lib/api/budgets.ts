import { env } from "@scanPe/env/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	Budget,
	CreateBudgetInput,
	UpdateBudgetInput,
} from "../../types/budget";
import { authClient } from "../auth-client";

const API_URL = env.EXPO_PUBLIC_SERVER_URL;

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
	const session = await authClient.getSession();
	if (session?.data?.session?.token) {
		return session.data.session.token;
	}
	return null;
}

// Fetch all budgets
async function fetchBudgets(): Promise<Budget[]> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/budgets`, {
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
		throw new Error(error.error || "Failed to fetch budgets");
	}

	return response.json();
}

// Create a new budget
async function createBudget(input: CreateBudgetInput): Promise<Budget> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/budgets`, {
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
		throw new Error(error.error || "Failed to create budget");
	}

	return response.json();
}

// Update a budget
async function updateBudget(
	id: string,
	input: UpdateBudgetInput,
): Promise<Budget> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/budgets/${id}`, {
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
		throw new Error(error.error || "Failed to update budget");
	}

	return response.json();
}

// Delete a budget
async function deleteBudget(id: string): Promise<void> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/budgets/${id}`, {
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
		throw new Error(error.error || "Failed to delete budget");
	}
}

// React Query hook to fetch budgets
export function useBudgets() {
	return useQuery({
		queryKey: ["budgets"],
		queryFn: fetchBudgets,
		// Only fetch if user is authenticated
		enabled: true,
		// Retry on auth errors
		retry: (failureCount, error) => {
			if (error instanceof Error && error.message.includes("Unauthorized")) {
				return false;
			}
			return failureCount < 3;
		},
	});
}

// React Query hook to create a budget
export function useCreateBudget() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createBudget,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}

// React Query hook to update a budget
export function useUpdateBudget() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
			updateBudget(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}

// React Query hook to delete a budget
export function useDeleteBudget() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBudget,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});
}
