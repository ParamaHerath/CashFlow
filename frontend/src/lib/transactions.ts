import { api } from "@/lib/api";
import type { TransactionPage, TransactionPayload } from "@/types/transactions";

type TransactionQuery = {
	page?: number;
	size?: number;
	search?: string;
	type?: string;
	category?: string;
	from?: string;
	to?: string;
	recurring?: boolean;
};

export async function fetchTransactions(query: TransactionQuery) {
	const { data } = await api.get<TransactionPage>("/api/transactions", {
		params: query,
	});
	return data;
}

export async function createTransaction(payload: TransactionPayload) {
	const { data } = await api.post("/api/transactions", payload);
	return data;
}

export async function updateTransaction(id: string, payload: TransactionPayload) {
	const { data } = await api.put(`/api/transactions/${id}`, payload);
	return data;
}

export async function deleteTransaction(id: string) {
	const { data } = await api.delete(`/api/transactions/${id}`);
	return data as { message: string };
}
