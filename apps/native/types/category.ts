export interface Category {
	id: string;
	name: string;
	icon: string;
	color: string;
	userId?: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryInput {
	name: string;
	icon?: string;
	color?: string;
}
