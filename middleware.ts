import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/request",
  "/verify",
  "/api/auth",
];

function isPublicRoute(pathname: string): boolean {
  return (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) || pathname.startsWith("/api/auth") // Better-auth API routes
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes to pass through
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie on protected routes
  // We check for the cookie directly instead of calling auth.api.getSession
  // to avoid importing Firebase Admin in Edge Runtime
  const cookieHeader = request.headers.get("cookie") || "";
  const hasSessionCookie =
    cookieHeader.includes("better-auth.session_token=") ||
    cookieHeader.includes("session_token=");

  // If no session cookie, redirect to login
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Add the current path as a redirect parameter so we can return after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie exists, allow the request to proceed
  // The actual session validation will happen in the page component
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
