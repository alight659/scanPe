import { env } from "@scanPe/env/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, CreateCategoryInput } from "../../types/category";
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

// Fetch all categories
async function fetchCategories(): Promise<Category[]> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/categories`, {
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
		throw new Error(error.error || "Failed to fetch categories");
	}

	return response.json();
}

// Create a new category
async function createCategory(input: CreateCategoryInput): Promise<Category> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/categories`, {
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
		throw new Error(error.error || "Failed to create category");
	}

	return response.json();
}

// Delete a category
async function deleteCategory(id: string): Promise<void> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("Not authenticated");
	}

	const response = await fetch(`${API_URL}/categories/${id}`, {
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
		throw new Error(error.error || "Failed to delete category");
	}
}

// React Query hook to fetch categories
export function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		retry: (failureCount, error) => {
			if (error instanceof Error && error.message.includes("Unauthorized")) {
				return false;
			}
			return failureCount < 3;
		},
	});
}

// React Query hook to create a category
export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

// React Query hook to delete a category
export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
