/**
 * Token helpers - tokens are now stored in memory (Redux) only
 * Access tokens are kept in Redux state and cleared on page refresh
 * Refresh tokens are stored in httpOnly cookies (secure, not accessible to JavaScript)
 */

const SESSION_KEY = "authenticated";

export const rememberSession = (rememberMe: boolean) => {
  sessionStorage.setItem(SESSION_KEY, "true");
  if (rememberMe) localStorage.setItem("rememberMe", "true");
  else localStorage.removeItem("rememberMe");
};

export const hasStoredSession = () =>
  sessionStorage.getItem(SESSION_KEY) === "true" || localStorage.getItem("rememberMe") === "true";

export const clearTokenStorage = () => {
  // Clear legacy auth artifacts (tokens/user) and non-sensitive flags
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  sessionStorage.removeItem(SESSION_KEY);
  // Refresh token cookie is cleared by backend on logout
};
