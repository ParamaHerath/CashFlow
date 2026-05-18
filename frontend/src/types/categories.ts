export type Category = {
	id: string;
	name: string;
	color: string;
	icon: string;
	monthlyTotal: number;
	expenseShare: number;
};

export type CategoryPayload = {
	name: string;
	color: string;
	icon: string;
};
