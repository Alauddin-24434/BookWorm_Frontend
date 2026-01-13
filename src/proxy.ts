import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Use Node.js runtime because 'jsonwebtoken' library requires it
export const runtime = 'nodejs';

export function proxy(request: NextRequest) {
  // 1. Extract token from cookies
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // 2. Redirect to login if token is missing
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || "your-secret-key";

    // 3. Verify and decode the JWT token
    const decoded = jwt.verify(token, secret) as any;
    const userRole = decoded.role; // Assuming 'role' is stored in your JWT payload

    console.log("Verified User Role:", userRole);

    // 4. Role-Based Access Control (RBAC)
    
    // Example: Only 'admin' can access the dashboard
    if (pathname.startsWith("/dashboard") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Example: Block specific roles from profile or settings
    if (pathname.startsWith("/settings") && userRole === "guest") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 5. Allow request to proceed if all checks pass
    return NextResponse.next();
    
  } catch (error) {
    // 6. If token is expired or invalid, redirect to login
    console.error("JWT Verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 7. Define which routes this middleware should run on
export const config = {
  matcher: [
    "/profile/:path*", 
    "/settings/:path*", 
    "/books/:path*", 
    "/dashboard/:path*"
  ],
};