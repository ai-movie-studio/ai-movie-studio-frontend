import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy.
 *
 * NOTE: Auth cookies are HttpOnly and live on the backend domain (Railway),
 * NOT on the Vercel frontend domain. This means we cannot check auth
 * server-side from this proxy — the cookies are invisible to it.
 *
 * Authentication enforcement happens client-side in:
 *   - AuthProvider (calls /v1/auth/me on mount with credentials)
 *   - (dashboard)/layout.tsx (redirects unauthenticated users)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect legacy /dashboard path to /projects
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
