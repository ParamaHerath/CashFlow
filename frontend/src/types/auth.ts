export type UserProfile = {
	id: string;
	fullName: string;
	email: string;
	role: string;
};

export type AuthResponse = {
	user: UserProfile;
	accessTokenExpiresAt: string;
};
