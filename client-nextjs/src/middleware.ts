import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/", "/register"];

  if (!token && !authRoutes.includes(pathname)) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  if (authRoutes.includes(pathname) && token) {
    const url = new URL("/feed", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed", "/profile", "/look/:path*", "/", "/register"],
};
