"use client";
import { AlertCircle, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <AlertCircle className="size-14 text-red-400 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-base text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
        </div>
        <button onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
          <RotateCw className="size-4" /> Try again
        </button>
      </div>
    </div>
  );
}
