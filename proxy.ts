import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken as verifyAdminToken } from "@/lib/auth-admin";
import { verifySessionToken as verifyClientToken } from "@/lib/auth-client";

// Public routes that don't require authentication
const publicPaths = [
  "/",
  "/chi-sono",
  "/servizi",
  "/contatti",
  "/sign-in",
  "/sign-up",
  "/invito",
  "/api/webhook",
  "/api/client/register",
  "/api/client/validate-invitation",
  "/api/client/login",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path));
}

async function handleAdminAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login API and logout API without auth check
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const token = request.cookies.get("admin-session")?.value;

  // Handle login page specifically
  if (pathname === "/admin/login") {
    // If user has a valid token, redirect to dashboard
    if (token) {
      const session = await verifyAdminToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin/clienti", request.url));
      }
    }
    // Allow access to login page if no token or invalid token
    return NextResponse.next();
  }

  // For all other admin routes, require authentication
  if (!token) {
    // Redirect to login for admin pages
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // Return 401 for admin API routes
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Verify token for authenticated routes
  const session = await verifyAdminToken(token);

  if (!session) {
    // Redirect to login for admin pages
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // Return 401 for admin API routes
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

async function handleClientAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for client session cookie
  const token = request.cookies.get("client-session")?.value;

  if (!token) {
    // Redirect to sign-in for client pages
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verify token
  const session = await verifyClientToken(token);

  if (!session) {
    // Redirect to sign-in for client pages
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for use in layouts
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Handle admin routes with custom auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authResponse = await handleAdminAuth(request);
    if (authResponse.headers.get("location")) {
      return authResponse;
    }
    authResponse.headers.set("x-pathname", pathname);
    return authResponse;
  }

  // Handle client routes with custom auth
  if (pathname.startsWith("/cliente")) {
    const authResponse = await handleClientAuth(request);
    if (authResponse.headers.get("location")) {
      return authResponse;
    }
    authResponse.headers.set("x-pathname", pathname);
    return authResponse;
  }

  // Allow public routes without checking auth
  if (isPublicPath(pathname)) {
    return response;
  }

  // Allow the request to continue
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
