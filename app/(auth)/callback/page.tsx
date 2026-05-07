"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveUser } from "@/app/lib/auth";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

/**
 * OAuth callback handler.
 *
 * Tokens are already set as HTTP-only cookies by the backend redirect.
 * The URL only contains non-sensitive user display info (name, email).
 * We save that for the UI and redirect to /projects.
 */
function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = params.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    // Auth cookies are already set by the backend.
    // URL only has display info — no tokens.
    const userId = parseInt(params.get("userId") ?? "0");
    const fullName = decodeURIComponent(
      params.get("fullName") ?? params.get("name") ?? "User",
    );
    const email = decodeURIComponent(params.get("email") ?? "");

    if (!userId && !email) {
      setError("Authentication failed. Missing user info.");
      return;
    }

    saveUser({
      id: userId,
      fullName,
      email,
      role: params.get("role") ?? "USER",
    });

    window.location.href = "/projects";
  }, [params, router]);

  if (error) {
    return (
      <div className="space-y-6 text-center">
        <AlertCircle className="size-12 text-red-400 mx-auto" />
        <h1 className="text-2xl font-bold">Sign in failed</h1>
        <p className="text-base text-muted-foreground">{error}</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-xl bg-purple-600 text-white font-medium"
        >
          Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <Loader2 className="size-10 animate-spin text-purple-500 mx-auto" />
      <p className="text-base text-muted-foreground">
        Completing Google sign-in…
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <Loader2 className="size-10 animate-spin text-purple-500 mx-auto mt-20" />
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
