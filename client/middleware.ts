import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const claims = token ? await verifySessionToken(token) : null;

  const authed = Boolean(claims?.sub);
  const hasSchool = Boolean(claims?.schoolId);

  if (pathname === "/login" || pathname === "/signup") {
    if (authed && hasSchool) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (authed && !hasSchool) {
      return NextResponse.redirect(new URL("/onboarding/school", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!authed) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!hasSchool) {
      return NextResponse.redirect(new URL("/onboarding/school", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/onboarding")) {
    if (!authed) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (hasSchool) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (authed && hasSchool) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (authed && !hasSchool) {
      return NextResponse.redirect(new URL("/onboarding/school", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*", "/onboarding/:path*"],
};
