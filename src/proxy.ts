import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/reset-password"];
const adminRoutes = ["/admin"];
const userRoutes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((r) => pathname.startsWith(r)) && session?.user) {
    const dest = session.user.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Protect user routes — must be logged in, and NOT admin
  if (userRoutes.some((r) => pathname.startsWith(r))) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protect admin routes — must be ADMIN
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/reset-password", "/dashboard/:path*", "/admin/:path*"],
};
