"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/auth-provider";
import { loginSchema, type LoginValues } from "@/app/lib/schemas";
import { normalizeError } from "@/app/lib/api-error";
import { env } from "@/app/config/env";
import { GoogleIcon } from "@/app/features/auth/google-icon";
import { Film, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError("");
    try {
      await login(values);
      router.push("/projects");
    } catch (err) {
      const e = normalizeError(err);
      if (e.message) setServerError(e.message);
      for (const [k, v] of Object.entries(e.fieldErrors)) {
        setError(k as keyof LoginValues, { message: v });
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 lg:hidden mb-8">
          <Film className="size-7 text-purple-500" />
          <span className="text-xl font-bold tracking-tight">AI Movie Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-base text-muted-foreground">Sign in to your account to continue creating</p>
      </div>

      <button onClick={() => { window.location.href = env.googleOAuthUrl; }}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted text-base font-medium transition-colors">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or sign in with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{serverError}</p>
          </div>
        )}

        <Field label="Email address" error={errors.email?.message}>
          <input {...register("email")} type="email" placeholder="you@example.com"
            className={fieldClass(errors.email)} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input {...register("password")} type={showPw ? "text" : "password"} placeholder="Enter your password"
              className={`${fieldClass(errors.password)} pr-12`} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base transition-colors disabled:opacity-50">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-base text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">Create one</Link>
      </p>
    </div>
  );
}

/* ── Reusable Field wrapper ─────────────────────── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="size-3.5" />{error}</p>}
    </div>
  );
}

function fieldClass(error?: { message?: string }) {
  return `w-full px-4 py-3 rounded-xl border bg-background text-base focus:outline-none focus:ring-2 transition-colors ${
    error ? "border-red-500 focus:ring-red-500/30" : "border-border focus:ring-purple-500/30"
  }`;
}
