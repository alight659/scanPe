import type { Category } from "./category";

export type Period = "daily" | "monthly" | "yearly";

export interface Budget {
	id: string;
	userId: string;
	categoryId: string;
	category: Category;
	limit: number;
	spent: number;
	period: Period;
	strictMode: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBudgetInput {
	categoryId: string;
	limit: number;
	period: Period;
	strictMode?: boolean;
}

export interface UpdateBudgetInput {
	limit?: number;
	period?: Period;
	strictMode?: boolean;
}

export interface BudgetFormData {
	categoryId: string;
	limit: string;
	period: Period;
	strictMode: boolean;
}
