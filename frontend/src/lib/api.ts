import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
	withCredentials: true,
});

export function getApiErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const message = (error.response?.data as { message?: string })?.message;
		return message ?? error.message ?? "Something went wrong";
	}

	return "Something went wrong";
}
