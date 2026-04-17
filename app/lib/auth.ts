/**
 * Client-side user info storage.
 *
 * IMPORTANT: This stores ONLY display info (name, email, role).
 * Auth tokens live in HTTP-only cookies managed by the backend.
 * JavaScript NEVER has access to tokens.
 */
import type { SessionUser } from "@/app/types";

const USER_KEY = "ams_user";

export function saveUser(user: SessionUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
