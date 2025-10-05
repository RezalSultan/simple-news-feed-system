import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppErrorResponse } from "./type/app-response-type";
import { refreshAccessToken, verifyToken } from "./service/auth-service";

function redirectToLogin(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.delete("token");
  res.cookies.delete("refresh_token");
  res.cookies.delete("username");

  return res;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/", "/register"];

  if (!accessToken && !authRoutes.includes(pathname)) {
    return redirectToLogin(request);
  }

  if (authRoutes.includes(pathname) && accessToken) {
    const url = new URL("/feed", request.url);
    return NextResponse.redirect(url);
  }

  if (accessToken) {
    try {
      const test = await verifyToken(accessToken);

      return NextResponse.next();
    } catch (err: unknown) {
      const error = err as AxiosError<AppErrorResponse>;
      if (
        error.response &&
        error.response.data.statusCode === 401 &&
        error.response.data.errors?.message === "Token expired" &&
        refreshToken
      ) {
        try {
          const response = await refreshAccessToken(refreshToken);
          const payload = response.data;

          const res = NextResponse.next();
          res.cookies.set("token", payload.data.token);
          return res;
        } catch (refreshErr) {
          return redirectToLogin(request);
        }
      }
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed",
    "/profile",
    "/look/:path*",
    "/find-new-friend",
    "/posting",
    "/",
    "/register",
  ],
};
