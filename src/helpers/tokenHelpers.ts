/**
 * Token helpers - tokens are now stored in memory (Redux) only
 * Access tokens are kept in Redux state and cleared on page refresh
 * Refresh tokens are stored in httpOnly cookies (secure, not accessible to JavaScript)
 */

export const clearTokenStorage = () => {
  // Clear legacy auth artifacts (tokens/user) and non-sensitive flags
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  // Refresh token cookie is cleared by backend on logout
};
