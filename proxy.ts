import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/chi-sono",
  "/servizi",
  "/contatti",
  "/admin-login(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Define client routes that require organization membership
const isClientRoute = createRouteMatcher(["/cliente(.*)"]);

// Define admin routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without checking auth
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId, orgId } = await auth();

  // Protect client routes - redirect to sign-in if not authenticated
  if (isClientRoute(request) && !userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect admin routes - redirect to admin login if not authenticated
  if (isAdminRoute(request) && !userId) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
