import { create } from "zustand";

import { api, getApiErrorMessage } from "@/lib/api";
import type { AuthResponse, UserProfile } from "@/types/auth";

type AuthState = {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
	hasBootstrapped: boolean;
};

type AuthActions = {
	bootstrap: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	register: (fullName: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (user: UserProfile | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
	user: null,
	isLoading: false,
	error: null,
	hasBootstrapped: false,
	setUser: (user) => set({ user }),
	bootstrap: async () => {
		if (get().hasBootstrapped) {
			return;
		}
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.get<UserProfile>("/api/auth/me");
			set({ user: data, isLoading: false, hasBootstrapped: true });
		} catch {
			set({ user: null, isLoading: false, hasBootstrapped: true });
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post<AuthResponse>("/api/auth/login", {
				email,
				password,
			});
			set({ user: data.user, isLoading: false });
		} catch (error) {
			const message = getApiErrorMessage(error);
			set({ error: message, isLoading: false });
			throw new Error(message);
		}
	},
	register: async (fullName, email, password) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post<AuthResponse>("/api/auth/register", {
				fullName,
				email,
				password,
			});
			set({ user: data.user, isLoading: false });
		} catch (error) {
			const message = getApiErrorMessage(error);
			set({ error: message, isLoading: false });
			throw new Error(message);
		}
	},
	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await api.post("/api/auth/logout");
			set({ user: null, isLoading: false });
		} catch (error) {
			const message = getApiErrorMessage(error);
			set({ error: message, isLoading: false });
			throw new Error(message);
		}
	},
}));
