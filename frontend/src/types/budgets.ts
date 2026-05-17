export type Budget = {
	id: string;
	category: string;
	amount: number;
	month: string;
	spent: number;
	remaining: number;
	usagePercent: number;
};

export type BudgetPayload = {
	category: string;
	amount: number;
	month: string;
};
