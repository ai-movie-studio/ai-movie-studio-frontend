import axios from "axios";
import { env } from "@/app/config/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    const isAuth =
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/register") ||
      original.url?.includes("/auth/refresh") ||
      original.url?.includes("/auth/me") ||
      original.url?.includes("/auth/logout");

    // 👉 Do NOT intercept auth endpoints
    if (isAuth) return Promise.reject(error);

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await axios.post(
          `${env.apiBaseUrl}/v1/auth/refresh`,
          {},
          { withCredentials: true },
        );

        return apiClient(original);
      } catch {
        // 👉 Prevent infinite redirect loop
        if (
          typeof window !== "undefined" &&
          !["/login", "/register", "/callback"].includes(
            window.location.pathname,
          )
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
