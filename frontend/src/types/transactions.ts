export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
	id: string;
	title: string;
	amount: number;
	type: TransactionType;
	category: string;
	note: string | null;
	date: string;
	recurring: boolean;
	createdAt: string;
};

export type TransactionPage = {
	items: Transaction[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
};

export type TransactionPayload = {
	title: string;
	amount: number;
	type: TransactionType;
	category: string;
	note?: string | null;
	date: string;
	recurring: boolean;
};
