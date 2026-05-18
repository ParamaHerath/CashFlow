import { api } from "@/lib/api";
import type { Category, CategoryPayload } from "@/types/categories";

type CategoryQuery = {
	from?: string;
	to?: string;
};

export async function fetchCategories(query?: CategoryQuery) {
	const { data } = await api.get<Category[]>("/api/categories", {
		params: query,
	});
	return data;
}

export async function createCategory(payload: CategoryPayload) {
	const { data } = await api.post<Category>("/api/categories", payload);
	return data;
}

export async function updateCategory(id: string, payload: CategoryPayload) {
	const { data } = await api.put<Category>(`/api/categories/${id}`, payload);
	return data;
}

export async function deleteCategory(id: string) {
	const { data } = await api.delete(`/api/categories/${id}`);
	return data as { message: string };
}
