export interface TransactionCategory {
	name: string;
	icon: string;
	color: string;
}

export interface TransactionBudget {
	id: string;
	category: TransactionCategory;
}

export interface Transaction {
	id: string;
	userId: string;
	budgetId: string | null;
	amount: number;
	merchant: string;
	description?: string;
	createdAt: string;
	budget?: TransactionBudget | null;
}

export interface CreateTransactionInput {
	budgetId: string;
	amount: number;
	merchant: string;
	description?: string;
}

export interface UpdateTransactionInput {
	budgetId?: string;
	amount?: number;
	merchant?: string;
	description?: string;
}
