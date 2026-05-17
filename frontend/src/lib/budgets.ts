import { api } from "@/lib/api";
import type { Budget, BudgetPayload } from "@/types/budgets";

type BudgetQuery = {
	month?: string;
};

export async function fetchBudgets(query?: BudgetQuery) {
	const { data } = await api.get<Budget[]>("/api/budgets", {
		params: query,
	});
	return data;
}

export async function createBudget(payload: BudgetPayload) {
	const { data } = await api.post<Budget>("/api/budgets", payload);
	return data;
}

export async function updateBudget(id: string, payload: BudgetPayload) {
	const { data } = await api.put<Budget>(`/api/budgets/${id}`, payload);
	return data;
}

export async function deleteBudget(id: string) {
	const { data } = await api.delete(`/api/budgets/${id}`);
	return data as { message: string };
}
