import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) { 
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. If NO token and user is trying to access ANY protected route
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secret) as any;
    const userRole = decoded.role;

    // --- NEW: Default Route Behavior ---
    // If a normal user accesses "/", redirect them to "/library"
    if (pathname === "/" && userRole === "user") {
      return NextResponse.redirect(new URL("/dashboard/user/library", request.url));
    }
    
    // If an admin accesses "/", you might want to send them to their dashboard
    if (pathname === "/" && userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. Admin Route Protection
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 3. User Dashboard Protection
    if (pathname.startsWith("/dashboard/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 4. Config Matcher
export const config = {
  matcher: [
    "/",
    "/profile/:path*", 
    "/settings/:path*", 
    "/books/:path*", 
    "/dashboard/:path*",
    "/library/:path*" 
  ],
};