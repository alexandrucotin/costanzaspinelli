import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * CRITICAL SECURITY FUNCTION
 * This function MUST be called at the start of every protected page
 * It ensures authentication is verified BEFORE any data fetching
 *
 * Defense-in-depth: Even though proxy checks auth, pages MUST verify too
 * This prevents data leaks if proxy is bypassed or misconfigured
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    // This should never happen due to proxy, but defense-in-depth
    redirect("/sign-in");
  }

  return { userId };
}

/**
 * Get authenticated client data
 * ONLY call this AFTER requireAuth()
 */
export async function getAuthenticatedClient() {
  const { userId } = await requireAuth();

  // Get user email from Clerk
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    throw new Error("User email not found");
  }

  return { userId, userEmail, clerkUser: user };
}
