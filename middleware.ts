import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  const isAdmin = token?.role === "admin";

  const isAdminRoute = path.startsWith("/admin");
  const isUserDashboard = path.startsWith("/dashboard");

  // ========= PUBLIC ROUTES REQUIRING LOGIN =========
  if (!token && (isAdminRoute || isUserDashboard)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin trying to enter user areas
  if (isAdmin && (isUserDashboard)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Normal user trying to enter admin area
  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
