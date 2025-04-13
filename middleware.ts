import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Convert secret to Uint8Array for jose
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
  return new TextEncoder().encode(secret);
};

// Paths that don't require authentication
const publicPaths = ["/", "/login", "/register", "/forgot-password"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check if the path is public
  if (
    publicPaths.some(
      (path) => pathname === path || (path !== "/" && pathname.startsWith(path))
    )
  ) {
    // For the root path, check if user is authenticated and redirect accordingly
    if (pathname === "/") {
      const token = request.cookies.get("token")?.value;

      // If there's a token, try to verify and redirect based on role
      if (token) {
        try {
          const { payload } = await jwtVerify(token, getJwtSecretKey());

          if (payload.role === "DOCTOR") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          } else if (payload.role === "PATIENT") {
            return NextResponse.redirect(
              new URL("/patient-portal", request.url)
            );
          }
        } catch (error) {
          // If token verification fails, continue to landing page
          console.error("Token verification failed:", error);
        }
      }
    }

    // Allow access to public paths
    return NextResponse.next();
  }

  // For protected paths, require authentication
  const token = request.cookies.get("token")?.value;

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    // Protect doctor routes
    if (pathname.startsWith("/dashboard") && payload.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/patient-portal", request.url));
    }

    // Protect patient routes
    if (pathname.startsWith("/patient-portal") && payload.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
