"use client"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUIStore } from "@/app/store/ui-store"
import { loginSchema } from "@/components/schema/auth_schema"
import { LoginTypes } from "@/lib/types"
import { AuthInput } from "@/components/AuthInput"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BackgroundSplit } from "@/components/ui/background-split"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

import { useIsMobile } from "@/hooks/use-mobile"

export default function LoginForm() {
  const isMobile = useIsMobile()
  const { isLoading, setLoading } = useUIStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginTypes>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginTypes) => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Login data:", data)
      // Here you would call your actual login API
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false) // stop loading
    }
  }


  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      {/* Background with Animation */}
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation
          containerClassName="h-full w-full"
          className="z-0"
        />
      </div>

      <BackgroundSplit
        className="min-h-screen"
        splitClassName="bg-white"
        variant="diagonal"
      >
        <div className={cn(
          "absolute z-20 transition-all duration-300",
          isMobile ? "top-6 left-1/2 -translate-x-1/2" : "top-8 left-8"
        )}>
          <h1 className={cn(
            "font-bold tracking-tight text-white",
            isMobile ? "text-xl" : "text-2xl"
          )}>Nabula</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "w-full bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/20 z-30 transition-all duration-300",
            isMobile ? "rounded-t-[32px] mt-20" : "max-w-[480px] rounded-[32px]"
          )}
        >
          <div className={cn(
            "transition-all duration-300",
            isMobile ? "p-8 md:p-10" : "p-10 md:p-12"
          )}>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in to your account</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AuthInput
                label="Email"
                placeholder="Enter your email"
                register={register("email")}
                error={errors.email?.message}
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <Label className="text-sm font-medium text-gray-700">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <AuthInput
                  label="" // Hidden label since we have custom header
                  type="password"
                  placeholder="Enter your password"
                  register={register("password")}
                  error={errors.password?.message}
                />
              </div>

              <div className="flex items-center space-x-2 px-0.5">
                <Checkbox id="remember" className="rounded-md border-gray-300" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-600 cursor-pointer select-none"
                >
                  Remember me for this device
                </Label>
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-medium">OR</span>
                </div>
              </div>
            </div>

            <Button

              variant="outline"
              className="w-full h-14 rounded-xl border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </Button>

            <div className="mt-8 text-center border-t border-gray-50 pt-6">
              <p className="text-sm text-gray-500">
                New to Nabula?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

      </BackgroundSplit>
    </div>
  )
}

