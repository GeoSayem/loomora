import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

// Protects the /admin section (except the login page itself). API-level
// admin checks in getSessionUser.ts are the real enforcement; this just
// avoids flashing the dashboard UI to unauthenticated visitors.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
