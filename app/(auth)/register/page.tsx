"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/auth-provider";
import { registerSchema, type RegisterValues } from "@/app/lib/schemas";
import { normalizeError } from "@/app/lib/api-error";
import { env } from "@/app/config/env";
import { GoogleIcon } from "@/app/features/auth/google-icon";
import { Film, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useState } from "react";

const PW_RULES = [
  { re: /.{8,}/, label: "8+ characters" },
  { re: /[A-Z]/, label: "Uppercase letter" },
  { re: /[a-z]/, label: "Lowercase letter" },
  { re: /[0-9]/, label: "Number" },
  { re: /[@$!%*?&#]/, label: "Special character" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });
  const pw = watch("password", "");

  const onSubmit = async (values: RegisterValues) => {
    setServerError("");
    try {
      await registerUser(values);
      router.push("/projects");
    } catch (err) {
      const e = normalizeError(err);
      if (e.message) setServerError(e.message);
      for (const [k, v] of Object.entries(e.fieldErrors)) {
        setError(k as keyof RegisterValues, { message: v });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 lg:hidden mb-8">
          <Film className="size-7 text-purple-500" />
          <span className="text-xl font-bold tracking-tight">AI Movie Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-base text-muted-foreground">Start creating AI-powered short films in minutes</p>
      </div>

      <button onClick={() => { window.location.href = env.googleOAuthUrl; }}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted text-base font-medium transition-colors">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" /><span className="text-sm text-muted-foreground">or register with email</span><div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" /><p className="text-sm text-red-400">{serverError}</p>
          </div>
        )}

        <Field label="Full Name" error={errors.fullName?.message}>
          <input {...register("fullName")} placeholder="Your full name" className={fc(errors.fullName)} />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <input {...register("email")} type="email" placeholder="you@example.com" className={fc(errors.email)} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input {...register("password")} type={showPw ? "text" : "password"} placeholder="Create a strong password" className={`${fc(errors.password)} pr-12`} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {pw && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              {PW_RULES.map((r) => (
                <span key={r.label} className={`flex items-center gap-1.5 text-sm ${r.re.test(pw) ? "text-emerald-400" : "text-muted-foreground/60"}`}>
                  {r.re.test(pw) ? <Check className="size-3.5" /> : <span className="size-3.5 rounded-full border border-current inline-block" />}
                  {r.label}
                </span>
              ))}
            </div>
          )}
        </Field>

        <button type="submit" disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base transition-colors disabled:opacity-50">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-base text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-2"><label className="text-sm font-semibold">{label}</label>{children}
    {error && <p className="flex items-center gap-1.5 text-sm text-red-400"><AlertCircle className="size-3.5" />{error}</p>}</div>);
}
function fc(e?: { message?: string }) {
  return `w-full px-4 py-3 rounded-xl border bg-background text-base focus:outline-none focus:ring-2 transition-colors ${e ? "border-red-500 focus:ring-red-500/30" : "border-border focus:ring-purple-500/30"}`;
}
