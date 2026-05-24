import { NextRequest, NextResponse } from "next/server";

// Cookie name must match app.jwt.access-cookie-name in application.properties
const ACCESS_COOKIE = "access_token";

// Routes that authenticated users must NOT see
const AUTH_ROUTES = new Set(["/", "/login", "/register"]);

// Prefix for routes that require authentication
const PROTECTED_PREFIX = ["/dashboard", "/transactions", "/budgets", "/categories", "/analytics", "/profile", "/settings"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = request.cookies.has(ACCESS_COOKIE);

	// Authenticated user trying to reach a public/auth page → send to dashboard
	if (hasSession && AUTH_ROUTES.has(pathname)) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Unauthenticated user trying to reach a protected page → send to login
	if (!hasSession && PROTECTED_PREFIX.some((prefix) => pathname.startsWith(prefix))) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static  (static files)
		 * - _next/image   (image optimisation)
		 * - favicon.ico   (browser icon)
		 * - public assets (svg, png, jpg, …)
		 * - api routes    (handled server-side)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
	],
};
