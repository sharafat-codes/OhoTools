import { createAuthClient } from "better-auth/react";

// No baseURL needed for same-origin usage — the client targets the current
// origin's /api/auth handler.
export const authClient = createAuthClient();

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  updateUser,
  changePassword,
} = authClient;
