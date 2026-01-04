import "server-only";

// Re-export client auth functions for backward compatibility
export {
  requireClientAuth as requireAuth,
  getAuthenticatedClient,
} from "./auth-client";
