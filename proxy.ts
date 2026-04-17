import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 👉 Accept multiple possible cookie names
  const hasToken =
    request.cookies.has("ams_access_token") ||
    request.cookies.has("access_token");

  // Redirect dashboard → projects
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  const isProtected =
    pathname.startsWith("/projects") || pathname === "/settings";

  // 👉 Block protected routes
  if (!hasToken && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 👉 Prevent logged-in users from seeing auth pages
  if (hasToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/projects/:path*",
    "/settings",
    "/login",
    "/register",
  ],
};
