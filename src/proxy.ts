import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const protectedPrefixes = ["/dashboard", "/arena"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // If trying to access a protected route without token cookie
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and visiting auth pages, let client RoleGuard redirect to dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/arena/:path*"],
};
