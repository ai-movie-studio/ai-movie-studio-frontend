/**
 * Centralised environment config.
 * Every env read happens here — nowhere else.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api",
  googleOAuthUrl:
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL ??
    "http://localhost:8080/api/oauth2/authorization/google",
} as const;
