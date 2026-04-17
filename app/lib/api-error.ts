import { AxiosError } from "axios";

/** Normalised shape every catch block can rely on. */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string>;
}

/**
 * Turn any Axios error into a predictable ApiError.
 * Components never touch `err.response.data` directly.
 */
export function normalizeError(err: unknown): ApiError {
  if (err instanceof AxiosError && err.response) {
    const { status, data } = err.response;
    const fieldErrors: Record<string, string> = {};

    if (data?.errors && typeof data.errors === "object") {
      for (const [k, v] of Object.entries(data.errors)) {
        fieldErrors[k] = String(v);
      }
    }

    let message = data?.message ?? "";
    if (status === 401) message = "Incorrect email or password.";
    if (status === 403) message = "Your account is locked. Contact support.";
    if (status === 409) {
      fieldErrors.email = "This email is already registered.";
      message = "";
    }
    if (!message && !Object.keys(fieldErrors).length) {
      message = "Something went wrong. Please try again.";
    }

    return { status, message, fieldErrors };
  }

  return {
    status: 0,
    message: "Network error. Check your connection.",
    fieldErrors: {},
  };
}
