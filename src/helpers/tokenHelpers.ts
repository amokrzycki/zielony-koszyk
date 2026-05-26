/**
 * Token helpers - tokens are now stored in memory (Redux) only
 * Access tokens are kept in Redux state and cleared on page refresh
 * Refresh tokens are stored in httpOnly cookies (secure, not accessible to JavaScript)
 */

export const clearTokenStorage = () => {
  // Clear only non-sensitive data
  localStorage.removeItem("rememberMe");
  // Refresh token cookie is cleared by backend on logout
};
